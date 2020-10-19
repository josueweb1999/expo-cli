import { JSONObject } from '@expo/json-file';
import { XcodeProject } from 'xcode';

import { ExpoConfig } from '../Config.types';
import { ConfigPlugin, Modifier, ModifierProps } from '../Plugin.types';
import { ExpoPlist, InfoPlist } from '../ios/IosConfig.types';
import { withExtendedModifier } from './core-plugins';

type MutateInfoPlistAction = (expo: ExpoConfig, infoPlist: InfoPlist) => InfoPlist;

/**
 * Helper method for creating modifiers from existing config functions.
 *
 * @param action
 */
export function createInfoPlistPlugin(
  action: MutateInfoPlistAction
): ConfigPlugin<MutateInfoPlistAction> {
  return config =>
    withInfoPlist(config, async config => {
      config.modProps.data = await action(config, config.modProps.data);
      return config;
    });
}

/**
 * Provides the Info.plist file for modification.
 * Keeps the config's expo.ios.infoPlist object in sync with the data.
 *
 * @param config
 * @param action
 */
export const withInfoPlist: ConfigPlugin<Modifier<ModifierProps<InfoPlist>>> = (config, action) => {
  return withExtendedModifier<ModifierProps<InfoPlist>>(config, {
    platform: 'ios',
    modifier: 'infoPlist',
    async action(config) {
      config = await action(config);
      if (!config.ios) {
        config.ios = {};
      }
      config.ios.infoPlist = config.modProps.data;
      return config;
    },
  });
};

/**
 * Provides the main .entitlements file for modification.
 * Keeps the config's expo.ios.entitlements object in sync with the data.
 *
 * @param config
 * @param action
 */
export const withEntitlementsPlist: ConfigPlugin<Modifier<ModifierProps<JSONObject>>> = (
  config,
  action
) => {
  return withExtendedModifier<ModifierProps<JSONObject>>(config, {
    platform: 'ios',
    modifier: 'entitlements',
    async action(config) {
      config = await action(config);
      if (!config.ios) {
        config.ios = {};
      }
      config.ios.entitlements = config.modProps.data;
      return config;
    },
  });
};

/**
 * Provides the Expo.plist for modification.
 *
 * @param config
 * @param action
 */
export const withExpoPlist: ConfigPlugin<Modifier<ModifierProps<ExpoPlist>>> = (config, action) => {
  return withExtendedModifier(config, {
    platform: 'ios',
    modifier: 'expoPlist',
    action,
  });
};

/**
 * Provides the main .xcodeproj for modification.
 *
 * @param config
 * @param action
 */
export const withXcodeProject: ConfigPlugin<Modifier<ModifierProps<XcodeProject>>> = (
  config,
  action
) => {
  return withExtendedModifier(config, {
    platform: 'ios',
    modifier: 'xcodeproj',
    action,
  });
};

/**
 * Modifiers that don't modify any data, all unresolved functionality is performed inside a dangerous modifier.
 *
 * @param config
 * @param action
 */
export const withDangerousModifier: ConfigPlugin<Modifier<ModifierProps<unknown>>> = (
  config,
  action
) => {
  return withExtendedModifier(config, {
    platform: 'ios',
    modifier: 'dangerous',
    action,
  });
};
