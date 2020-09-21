import { JSONObject } from '@expo/json-file';

export type URLScheme = {
  CFBundleURLName?: string;
  CFBundleURLSchemes: string[];
};

export type InterfaceOrientation =
  | 'UIInterfaceOrientationPortrait'
  | 'UIInterfaceOrientationPortraitUpsideDown'
  | 'UIInterfaceOrientationLandscapeLeft'
  | 'UIInterfaceOrientationLandscapeRight';

export type Plist = JSONObject;

export type InfoPlist = {
  CFBundleShortVersionString?: string;
  CFBundleVersion?: string;
  CFBundleDisplayName?: string;
  CFBundleIdentifier?: string;
  CFBundleName?: string;
  CFBundleURLTypes?: URLScheme[];
  ITSAppUsesNonExemptEncryption?: boolean;
  LSApplicationQueriesSchemes?: string[];
  FacebookAppID?: string;
  FacebookDisplayName?: string;
  FacebookAutoInitEnabled?: boolean;
  FacebookAutoLogAppEventsEnabled?: boolean;
  FacebookAdvertiserIDCollectionEnabled?: boolean;
  UISupportedInterfaceOrientations?: InterfaceOrientation[];
  GMSApiKey?: string;
  GADApplicationIdentifier?: string;
};

export type ExpoPlist = {
  EXUpdatesCheckOnLaunch?: string;
  EXUpdatesEnabled?: boolean;
  EXUpdatesLaunchWaitMs?: number;
  EXUpdatesReleaseChannel?: string;
  EXUpdatesRuntimeVersion?: string;
  EXUpdatesSDKVersion?: string;
  EXUpdatesURL?: string;
};
