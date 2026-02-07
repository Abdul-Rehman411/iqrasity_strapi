import React, { useState, useEffect } from 'react';
import {
  Main,
  Button,
  Flex,
  Box,
  Typography,
  Alert,
  Loader,
  Grid,
  Card,
  CardBody,
  Divider,
  Switch, // Toggle
  SingleSelect,
  SingleSelectOption
} from '@strapi/design-system';
import { Layouts, useFetchClient } from '@strapi/admin/strapi-admin';

// Custom Icons
const SyncIcon = () => (
  <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z" fill="currentColor"/>
  </svg>
);

const HomePage = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({ courses: 0, categories: 0, lastSync: 'Never' });
  
  // Settings State
  const [settings, setSettings] = useState({ enabled: false, interval: 30000 });
  const [savingSettings, setSavingSettings] = useState(false);

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
    try {
      const { data } = await get('/moodle-sync/settings');
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchSettings();
  }, []);

  // Poll stats dynamic to sync interval
  useEffect(() => {
    const pollInterval = Math.max(10000, settings.interval);
    const interval = setInterval(fetchStats, pollInterval);
    return () => clearInterval(interval);
  }, [settings.interval]);

  const handleSync = async () => {
    if (loading) return; 

    setLoading(true);
    setStatus(null);
    try {
      const { data } = await post('/moodle-sync/sync/all');
      setStatus('success');
      setResult(data.result);
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
    setSavingSettings(true);
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings); // Optimistic UI update

    try {
      // Only send the changed property to avoid false logs
      await put('/moodle-sync/settings', { [key]: value });
    } catch (err) {
      console.error('Failed to save settings', err);
      // Revert on error
      fetchSettings();
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <Main>
      <Layouts.Header
        title="Moodle Synchronization"
        subtitle="Manage synchronization between Moodle and Strapi"
        as="h2"
      />
      <Layouts.Content>
        <Flex direction="column" gap={6} alignItems="stretch">
          
          {/* Stats Section */}
          <Box>
            <Typography variant="beta" as="h3">Overview</Typography>
            <Box paddingTop={4}>
              <Card>
                <CardBody>
                  <Flex justifyContent="space-around" alignItems="center" gap={4}>
                    <Flex direction="column" alignItems="center" gap={2}>
                      <Typography variant="sigma" textColor="neutral600">Total Courses</Typography>
                      <Typography 
                        variant="alpha" 
                        textColor="primary600" 
                        style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2' }}
                      >
                        {stats.courses}
                      </Typography>
                    </Flex>
                    
                    <Box height="3rem" width="1px" background="neutral200" />
                    
                    <Flex direction="column" alignItems="center" gap={2}>
                      <Typography variant="sigma" textColor="neutral600">Total Categories</Typography>
                      <Typography 
                        variant="alpha" 
                        textColor="primary600"
                        style={{ fontSize: '3rem', fontWeight: '800', lineHeight: '1.2' }}
                      >
                        {stats.categories}
                      </Typography>
                    </Flex>

                    <Box height="3rem" width="1px" background="neutral200" />

                    <Flex direction="column" alignItems="center" gap={2}>
                      <Typography variant="sigma" textColor="neutral600">Last Synced</Typography>
                      <Typography variant="epsilon" textColor="neutral800">
                        {stats.lastSync === 'Never' ? 'Never' : new Date(stats.lastSync).toLocaleString()}
                      </Typography>
                    </Flex>
                  </Flex>
                </CardBody>
              </Card>
            </Box>
          </Box>

          {/* Settings Section */}
          <Box padding={6} background="neutral0" shadow="filterShadow" hasRadius>
            <Typography variant="beta" as="h3">Configuration</Typography>
            <Divider />
            <Box paddingTop={4}>
               <Flex gap={8} alignItems="end">
                  <Box>
                    <Typography variant="pi" fontWeight="bold">Auto-Sync Status</Typography>
                    <Box paddingTop={2}>
                      <Switch 
                        label="Enable Automatic Synchronization" 
                        selected={settings.enabled} 
                        onChange={() => handleSettingsChange('enabled', !settings.enabled)}
                      />
                    </Box>
                  </Box>

                  <Box style={{ minWidth: '200px' }}>
                    <SingleSelect 
                      label="Sync Interval" 
                      placeholder="Select interval"
                      value={String(settings.interval)} 
                      onChange={(val) => handleSettingsChange('interval', parseInt(val))}
                      disabled={!settings.enabled}
                    >
                      <SingleSelectOption value="30000">30 Seconds</SingleSelectOption>
                      <SingleSelectOption value="60000">1 Minute</SingleSelectOption>
                      <SingleSelectOption value="300000">5 Minutes</SingleSelectOption>
                      <SingleSelectOption value="900000">15 Minutes</SingleSelectOption>
                      <SingleSelectOption value="3600000">1 Hour</SingleSelectOption>
                      <SingleSelectOption value="21600000">6 Hours</SingleSelectOption>
                      <SingleSelectOption value="43200000">12 Hours</SingleSelectOption>
                      <SingleSelectOption value="86400000">24 Hours</SingleSelectOption>
                    </SingleSelect>
                  </Box>

                  <Box paddingBottom={2}>
                    <Typography variant="pi" textColor="neutral500">
                      {savingSettings ? 'Saving...' : 'Changes apply immediately.'}
                    </Typography>
                  </Box>
               </Flex>
            </Box>
          </Box>

          {/* Main Action Section */}
          <Box padding={8} background="neutral0" shadow="filterShadow" hasRadius>
            <Flex direction="column" alignItems="center" gap={6} style={{ textAlign: 'center' }}>
              <Box>
                {/* Updated to match Overview header size */}
                <Typography variant="beta" as="h2">Manual Synchronization</Typography>
                <Box paddingTop={2}>
                  <Typography variant="omega" textColor="neutral600">
                    Force a full update of all categories and courses from Moodle.
                  </Typography>
                </Box>
              </Box>

              <Button 
                size="L"
                variant="default" 
                startIcon={<SyncIcon />} 
                disabled={loading}
                onClick={handleSync}
                loading={loading}
              >
                {loading ? 'Synchronizing...' : 'Start Full Synchronization'}
              </Button>
            </Flex>
          </Box>

          {/* Status Alerts */}
          {status && (
            <Box>
              {// ... Alerts remain same ...
              }
              {status === 'success' && (
                <Alert title="Sync Completed Successfully" variant="success" onClose={() => setStatus(null)}>
                  {result && (
                    <Box>
                      <Typography variant="omega" fontWeight="bold">Categories:</Typography>
                      <Typography variant="omega"> Created: {result.categories.created}, Updated: {result.categories.updated}</Typography>
                      <Box paddingTop={1} />
                      <Typography variant="omega" fontWeight="bold">Courses:</Typography>
                      <Typography variant="omega"> Created: {result.courses.created}, Updated: {result.courses.updated}</Typography>
                    </Box>
                  )}
                </Alert>
              )}

              {status === 'error' && (
                <Alert title="Sync Failed" variant="danger" onClose={() => setStatus(null)}>
                  {result?.message}
                </Alert>
              )}
            </Box>
          )}

        </Flex>
      </Layouts.Content>
    </Main>
  );
};

export default HomePage;
