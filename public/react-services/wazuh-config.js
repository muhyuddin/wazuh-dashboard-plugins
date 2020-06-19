/*
 * Wazuh app - Pattern Handler service
 * Copyright (C) 2015-2020 Wazuh, Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * Find more information about this on the LICENSE file.
 */

export class WazuhConfig {
  constructor() {
    if (!!WazuhConfig.instance) {
      return WazuhConfig.instance;
    }
    WazuhConfig.instance = this;

    this.config = {};

    return this;
  }

  /**
   * Set given configuration
   * @param {Object} cfg
   */
  setConfig(cfg) {
    this.config = { ...cfg };
  }

  /**
   * Get configuration
   */
  getConfig() {
    return this.config;
  }

  /**
   * Returns true if debug level is enabled, otherwise it returns false.
   */
  isDebug() {
    return ((this.config || {})['logs.level'] || false) === 'debug';
  }
}