import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface EsimInfo {
  isEsimSupported: boolean;
  isEsimEnabled: boolean;
  carrierName?: string;
  iccid?: string;
  mobileCountryCode?: string;
  mobileNetworkCode?: string;
}

export interface EsimInstallationData {
  activationCode: string;
  confirmationCode?: string;
}

export interface CellularPlan {
  carrierName: string;
  mobileCountryCode: string;
  mobileNetworkCode: string;
  slotId?: string;
  subscriptionId?: number;
  isEmbedded?: boolean;
}

export interface Spec extends TurboModule {
  requestPermissions(): Promise<boolean>;
  isEsimSupported(): Promise<boolean>;
  isEsimEnabled(): Promise<boolean>;
  getEsimInfo(): Promise<EsimInfo>;
  installEsimProfile(data: EsimInstallationData): Promise<boolean>;
  getCellularPlans(): Promise<CellularPlan[]>;
}

export default TurboModuleRegistry.get<Spec>('EsimManager');
