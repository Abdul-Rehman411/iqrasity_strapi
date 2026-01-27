import { useEffect, useRef } from 'react';
import pluginId from '../pluginId';

const Initializer = ({ setPluginReady }) => {
  const prevSetPluginReady = useRef();
  prevSetPluginReady.current = setPluginReady;

  useEffect(() => {
    prevSetPluginReady.current(pluginId);
  }, []);

  return null;
};

export default Initializer;
