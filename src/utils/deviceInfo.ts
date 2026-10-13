import { Platform } from 'react-native';

export interface DeviceInfoPayload {
  platform: string;
  os_version: string;
  osVersion: string;
  brand: string;
  manufacturer: string;
  model: string;
  is_tablet: boolean;
  isTablet: boolean;
  app_name: string;
  appName: string;
  [key: string]: any;
}

/**
 * Returns structured device information for push notification
 * tracking, analytics, and session auditing across Android and iOS.
 */
export const getDeviceInfo = (): DeviceInfoPayload => {
  const isAndroid = Platform.OS === 'android';
  const constants: any = Platform.constants || {};

  const brand = isAndroid ? (constants.Brand || 'Android') : 'Apple';
  const manufacturer = isAndroid ? (constants.Manufacturer || 'Android') : 'Apple';
  const model = isAndroid
    ? (constants.Model || 'Android Device')
    : (constants.model || 'iOS Device');
  const osVersion = String(Platform.Version ?? '');
  const isTablet = Boolean((Platform as any).isPad || false);

  return {
    platform: Platform.OS,
    os_version: osVersion,
    osVersion,
    brand,
    manufacturer,
    model,
    is_tablet: isTablet,
    isTablet,
    app_name: 'SmartCart',
    appName: 'SmartCart',
  };
};

export default getDeviceInfo;
