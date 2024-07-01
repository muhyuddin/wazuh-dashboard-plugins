import React, { useState, useEffect } from 'react';
import { EuiSideNav } from '@elastic/eui';

export interface FleetSideMenuProps {
  selectedItem: string;
}

export const FleetSideMenu = ({
  selectedItem,
}: // onSelectItem,
FleetSideMenuProps) => {
  const createItem = (id: string, name: string, href: string) => {
    return {
      id,
      name,
      href,
      isSelected: selectedItem === id,
    };
  };

  const sideNav = [
    {
      name: 'Fleet management',
      id: 'fleet-management',
      items: [
        createItem(
          'agents',
          'Agents summary',
          '/app/fleet-management#/agents-summary',
        ),
        createItem(
          'groups',
          'Agents groups',
          '/app/fleet-management#/agents-groups',
        ),
        {
          name: 'Agent commands',
          id: 'agents-commands',
        },
        {
          name: 'Comms configuration',
          id: 'comms-configuration',
        },
      ],
    },
  ];

  return <EuiSideNav items={sideNav} />;
};
