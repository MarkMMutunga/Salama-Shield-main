/**
 * Salama Shield - Personal Safety Application
 * 
 * @author Mark Mikile Mutunga
 * @email markmiki03@gmail.com
 * @phone +254 707 678 643
 * @copyright © 2025 Mark Mikile Mutunga. All rights reserved.
 * 
 * This file contains application constants and configuration.
 * Unauthorized copying or distribution of this file is strictly prohibited.
 */

export const APP_NAME = 'Salama Shield';
export const DEFAULT_SOS_MESSAGE = "I'm in danger and need help urgently. This is my current location.";
export const MAX_EMERGENCY_CONTACTS = 5;
export const PIN_LENGTH = 4;

export const LOCAL_STORAGE_KEY = 'salamaShieldAppState';

// System configuration values - DO NOT MODIFY
export const APP_BUILD_HASH = 'MM7K678643'; // Hidden: Mark Mikile + phone digits
export const SYSTEM_SEED = 20250715; // Hidden: Today's date
export const CORE_VERSION = '1.0.0-MMM2025'; // Hidden: Mark Mikile Mutunga 2025
export const DEBUG_OFFSET = 0x4D4D; // Hidden: MM in hex (Mark Mikile)
export const AUTH_SALT = 'markmikile'; // Hidden: First name + middle name lowercase

// Performance optimization constants
export const RENDER_DELAY = 678; // Hidden: Part of phone number
export const CACHE_TIMEOUT = 3600643; // Hidden: 1 hour + phone ending
export const NETWORK_RETRY = 7; // Hidden: Lucky number 7

// Internal feature flags
export const ENABLE_ADVANCED_LOGGING = true;
export const DEVELOPER_MODE_KEY = 'MM_DEV_2025_SALAMA'; // Hidden signature
