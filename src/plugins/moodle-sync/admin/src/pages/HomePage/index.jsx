import React, { useState, useEffect, useRef } from 'react';
import {
  Main,
  Button,
  Flex,
  Box,
  Typography,
  Alert,
  Loader,
  Card,
  CardBody,
  Divider,
  Switch, // Toggle
  SingleSelect,
  SingleSelectOption,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th
} from '@strapi/design-system';
import { Layouts, useFetchClient } from '@strapi/admin/strapi-admin';

// Custom Icons
const SyncIcon = () => (
  <svg width="1.2rem" height="1.2rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z" fill="currentColor"/>
  </svg>
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const reportRef = useRef(null);

  // Auto-scroll to report when success
  useEffect(() => {
    if (status === 'success' && reportRef.current) {
      setTimeout(() => {
        reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [status]);

  const handleCloseAlert = () => {
    setStatus(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const [stats, setStats] = useState({ courses: 0, categories: 0, lastSync: 'Never' });
  
  // Settings State
  const [settings, setSettings] = useState({ enabled: false, interval: 30000 });
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [settingsError, setSettingsError] = useState(null);

  const { post, get, put } = useFetchClient();

  const fetchStats = async () => {
    try {
      const { data } = await get('/moodle-sync/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const fetchSettings = async () => {
    setSettingsLoaded(false);
    setSettingsError(null);
    try {
      const { data } = await get('/moodle-sync/settings');
      setSettings(data);
      setSettingsLoaded(true);
    } catch (err) {
      console.error('Failed to fetch settings', err);
      setSettingsError(err.response?.status === 401 ? 'Session expired. Please refresh page.' : 'Failed to load settings.');
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const [statsRes, settingsRes] = await Promise.all([
          get('/moodle-sync/stats'),
          get('/moodle-sync/settings')
        ]);
        
        if (mounted) {
          setStats(statsRes.data);
          setSettings(settingsRes.data);
          setSettingsLoaded(true);
        }
      } catch (err) {
        if (mounted) {
          console.error('Initialization failed', err);
          if (err.response?.status === 401) {
            setSettingsError('Session expired. Please refresh page.');
          }
        }
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  // Poll stats ONLY when enabled
  useEffect(() => {
    if (!settings.enabled) return;

    const pollInterval = Math.max(10000, settings.interval);
    const interval = setInterval(fetchStats, pollInterval);
    return () => clearInterval(interval);
  }, [settings.enabled, settings.interval]);

  const handleSync = async () => {
    if (loading) return; 

    setLoading(true);
    setStatus(null);
    try {
      const { data } = await post('/moodle-sync/sync/all');
      setStatus('success');
      setResult(data); // Flattened result from service
      fetchStats(); 
    } catch (err) {
      console.error(err);
      setStatus('error');
      const message = err.response?.data?.error?.message || err.message || 'Sync failed';
      setResult({ message });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsChange = async (key, value) => {
    if (savingSettings) return;

    console.log(`[Plugin] Changing ${key} to ${value}`);
    setSavingSettings(true);
    const prevSettings = { ...settings };
    const newSettings = { ...settings, [key]: value };
    
    setSettings(newSettings); // Optimistically update UI

    try {
      const { data } = await put('/moodle-sync/settings', newSettings);
      setStatus('settings-saved');
      setSettings(data);
    } catch (err) {
      console.error('[Plugin] Settings Save Failed:', err);
      setSettings(prevSettings);
      setStatus('error');
      const errorMsg = err.response?.data?.error?.message || err.message || 'Unknown error';
      setResult({ message: `Failed to save settings: ${errorMsg}` });
      fetchSettings();
    } finally {
      setSavingSettings(false);
    }
  };

  // elite-ui Styles
  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
    borderRadius: '16px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const injectStyles = `
    @keyframes pulse-glow {
      0% { box-shadow: 0 0 0 0 rgba(73, 69, 255, 0.6); transform: scale(1); }
      70% { box-shadow: 0 0 0 15px rgba(73, 69, 255, 0); transform: scale(1.02); }
      100% { box-shadow: 0 0 0 0 rgba(73, 69, 255, 0); transform: scale(1); }
    }
    @keyframes fade-in-up {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-pulse-sync { animation: pulse-glow 2.5s infinite; }
    .animate-fade-in { animation: fade-in-up 0.5s ease-out forwards; }
    .glass-card:hover { 
      transform: translateY(-6px); 
      box-shadow: 0 15px 45px 0 rgba(31, 38, 135, 0.12) !important;
      border-color: rgba(73, 69, 255, 0.3);
    }
    .hero-gradient {
      background: linear-gradient(135deg, #4945ff 0%, #8c89ff 50%, #4945ff 100%);
      background-size: 200% 200%;
      animation: gradient-flow 8s ease infinite;
    }
    @keyframes gradient-flow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;

  return (
    <Main background="neutral100" style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <style>{injectStyles}</style>
      
      <Layouts.Content>
        <Box style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <Flex direction="column" gap={6} alignItems="stretch">
            
            {/* Centered Main Header */}
            <Box paddingBottom={6} style={{ textAlign: 'center', marginTop: '3rem' }}>
              <Typography variant="alpha" textColor="neutral800" style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2' }}>
                Moodle Synchronization
              </Typography>
              <Box paddingTop={4}>
                <Typography variant="delta" textColor="neutral600" style={{ fontSize: '1.2rem', fontWeight: '500' }}>
                  Automated synchronization management for courses and categories
                </Typography>
              </Box>
            </Box>
            
            {/* Dashboard Analytics Section */}
            <Box className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Flex gap={4} alignItems="stretch">
                
                <Box flex="1" padding={6} background="neutral0" hasRadius shadow="filterShadow" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Flex direction="column" alignItems="center" gap={4} style={{ textAlign: 'center' }}>
                    <Box padding={3} background="primary100" style={{ borderRadius: '12px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4945ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                    </Box>
                    <Box>
                      <Typography variant="pi" fontWeight="bold" textColor="neutral600" textTransform="uppercase" style={{ letterSpacing: '0.02em' }}>
                        Total Courses
                      </Typography>
                      <Box paddingTop={1}>
                        <Typography variant="alpha" textColor="neutral800" style={{ fontSize: '2.2rem', fontWeight: '800' }}>
                          {stats.courses}
                        </Typography>
                      </Box>
                    </Box>
                  </Flex>
                </Box>

                <Box flex="1" padding={6} background="neutral0" hasRadius shadow="filterShadow" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Flex direction="column" alignItems="center" gap={2} style={{ textAlign: 'center' }}>
                    <Box padding={3} background="secondary100" style={{ borderRadius: '12px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6e239a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                    </Box>
                    <Box paddingTop={2}>
                      <Typography variant="pi" fontWeight="bold" textColor="neutral600" textTransform="uppercase" style={{ letterSpacing: '0.02em' }}>
                        Total Categories
                      </Typography>
                      <Box paddingTop={1}>
                        <Typography variant="alpha" textColor="neutral800" style={{ fontSize: '2.2rem', fontWeight: '800' }}>
                          {stats.categories}
                        </Typography>
                      </Box>
                    </Box>
                  </Flex>
                </Box>

                <Box flex="1" padding={6} background="neutral0" hasRadius shadow="filterShadow" style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Flex direction="column" alignItems="center" gap={2} style={{ textAlign: 'center' }}>
                    <Box padding={3} background="success100" style={{ borderRadius: '12px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </Box>
                    <Box paddingTop={2}>
                      <Typography variant="pi" fontWeight="bold" textColor="neutral600" textTransform="uppercase" style={{ letterSpacing: '0.02em' }}>
                        Last Sync Time
                      </Typography>
                      <Box paddingTop={1}>
                        <Typography variant="delta" textColor="neutral800" style={{ fontWeight: 800, fontSize: '1.2rem', display: 'block' }}>
                          {stats.lastSync === 'Never' ? 'Never' : new Date(stats.lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                        <Typography variant="pi" textColor="neutral500" style={{ marginTop: '2px', display: 'block' }}>
                          {stats.lastSync === 'Never' ? 'Waiting for initialization' : new Date(stats.lastSync).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Flex>
                </Box>
              </Flex>
            </Box>

            {/* Configuration Panel */}
            <Box className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Box padding={6} background="neutral0" shadow="filterShadow" hasRadius style={{ border: '1px solid rgba(0,0,0,0.05)' }}>
                <Flex justifyContent="space-between" alignItems="center">
                  <Box>
                    <Flex gap={3} alignItems="center">
                      <Typography variant="beta" fontWeight="bold">Auto-Sync Settings</Typography>
                      <Box 
                        width="8px" 
                        height="8px" 
                        background={settings.enabled ? "success600" : "danger600"} 
                        style={{ 
                          borderRadius: '50%', 
                          boxShadow: settings.enabled ? '0 0 8px rgba(50, 128, 72, 0.5)' : '0 0 8px rgba(220, 38, 38, 0.5)' 
                        }} 
                      />
                    </Flex>
                    <Typography variant="pi" textColor="neutral600">Configure background worker status and polling frequency</Typography>
                  </Box>
                  
                  <Flex gap={4} alignItems="end">
                    {!settingsLoaded ? <Loader small /> : (
                      <>
                        <Box style={{ minWidth: '180px' }}>
                          <SingleSelect 
                            label="Auto-Sync" 
                            value={String(settings.enabled)} 
                            onChange={(val) => handleSettingsChange('enabled', val === 'true')}
                            disabled={savingSettings}
                          >
                            <SingleSelectOption value="true">Enabled</SingleSelectOption>
                            <SingleSelectOption value="false">Disabled</SingleSelectOption>
                          </SingleSelect>
                        </Box>
                        <Box style={{ minWidth: '180px' }}>
                          <SingleSelect 
                            label="Sync Interval" 
                            value={String(settings.interval)} 
                            onChange={(val) => handleSettingsChange('interval', parseInt(val))}
                            disabled={!settings.enabled || savingSettings}
                          >
                            <SingleSelectOption value="30000">30 Seconds</SingleSelectOption>
                            <SingleSelectOption value="60000">1 Minute</SingleSelectOption>
                            <SingleSelectOption value="300000">5 Minutes</SingleSelectOption>
                            <SingleSelectOption value="3600000">1 Hour</SingleSelectOption>
                            <SingleSelectOption value="43200000">12 Hours</SingleSelectOption>
                            <SingleSelectOption value="86400000">24 Hours</SingleSelectOption>
                          </SingleSelect>
                        </Box>
                      </>
                    )}
                  </Flex>
                </Flex>
              </Box>
            </Box>

            {/* Sync Action Zone */}
            <Box className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Box padding={10} background="neutral0" shadow="filterShadow" hasRadius style={{ textAlign: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                <Flex direction="column" gap={6}>
                  <Box>
                    <Typography variant="beta" fontWeight="bold">Manual Synchronization</Typography>
                    <Box paddingTop={2}>
                      <Typography variant="omega" textColor="neutral600">
                        Instantly reconcile all course and category data from the Moodle environment.
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Button 
                      size="L"
                      className={!loading && !savingSettings ? 'animate-pulse-sync' : ''}
                      startIcon={<SyncIcon />} 
                      disabled={loading || savingSettings}
                      onClick={handleSync}
                      loading={loading}
                      style={{ 
                        borderRadius: '12px',
                        padding: '1rem 3rem',
                        fontWeight: 'bold',
                        boxShadow: !loading ? '0 8px 20px -6px rgba(73, 69, 255, 0.4)' : 'none'
                      }}
                    >
                      {loading ? 'Synchronizing...' : 'Start Sync Now'}
                    </Button>
                  </Box>
                </Flex>
              </Box>
            </Box>

            {/* Status Feed */}
            <Box className="animate-fade-in" style={{ animationDelay: '0.4s' }} ref={reportRef}>
              {status && (
                <Box>
                  {status === 'success' && (
                    <Alert title="Synchronization Successful" variant="success" onClose={handleCloseAlert}>
                      {result && (
                        <Box paddingTop={4} paddingBottom={2}>
                          <Flex direction="column" gap={4} alignItems="center" style={{ width: '100%' }}>
                            <Typography variant="beta" fontWeight="bold">Detailed Sync Report</Typography>
                            <Box style={{ width: '100%', overflowX: 'auto' }}>
                              <Table colCount={6} rowCount={2}>
                                <Thead>
                                  <Tr>
                                    <Th><Typography variant="sigma" textColor="neutral600">Type</Typography></Th>
                                    <Th><Typography variant="sigma" textColor="neutral600">Created</Typography></Th>
                                    <Th><Typography variant="sigma" textColor="neutral600">Updated</Typography></Th>
                                    <Th><Typography variant="sigma" textColor="neutral600">Skipped</Typography></Th>
                                    <Th><Typography variant="sigma" textColor="neutral600">Deleted</Typography></Th>
                                    <Th><Typography variant="sigma" textColor="neutral600">Total</Typography></Th>
                                  </Tr>
                                </Thead>
                                <Tbody>
                                  <Tr>
                                    <Td><Typography textColor="neutral800" fontWeight="bold">Categories</Typography></Td>
                                    <Td><Typography textColor="success600" fontWeight="bold">{result.categories?.created || 0}</Typography></Td>
                                    <Td><Typography textColor="primary600" fontWeight="bold">{result.categories?.updated || 0}</Typography></Td>
                                    <Td><Typography textColor="neutral500">{result.categories?.skipped || 0}</Typography></Td>
                                    <Td><Typography textColor="danger600">{result.categories?.removed || 0}</Typography></Td>
                                    <Td><Typography textColor="neutral800" fontWeight="bold">
                                      {(result.categories?.created || 0) + (result.categories?.updated || 0)}
                                    </Typography></Td>
                                  </Tr>
                                  <Tr>
                                    <Td><Typography textColor="neutral800" fontWeight="bold">Courses</Typography></Td>
                                    <Td><Typography textColor="success600" fontWeight="bold">{result.courses?.created || 0}</Typography></Td>
                                    <Td><Typography textColor="primary600" fontWeight="bold">{result.courses?.updated || 0}</Typography></Td>
                                    <Td><Typography textColor="neutral500">{result.courses?.skipped || 0}</Typography></Td>
                                    <Td><Typography textColor="danger600">{result.courses?.removed || 0}</Typography></Td>
                                    <Td><Typography textColor="neutral800" fontWeight="bold">
                                      {(result.courses?.created || 0) + (result.courses?.updated || 0)}
                                    </Typography></Td>
                                  </Tr>
                                </Tbody>
                              </Table>
                            </Box>
                          </Flex>
                        </Box>
                      )}
                    </Alert>
                  )}
                  {status === 'error' && (
                    <Alert title="Error" variant="danger" onClose={handleCloseAlert}>
                      {result?.message}
                    </Alert>
                  )}
                  {status === 'settings-saved' && (
                    <Alert title="Saved" variant="success" onClose={handleCloseAlert}>
                      Settings updated successfully.
                    </Alert>
                  )}
                </Box>
              )}
            </Box>

          </Flex>
        </Box>
      </Layouts.Content>
    </Main>
  );
};

export default HomePage;
