import React from 'react';
import { getNavLinkList } from '../../modules/NavLinkList';
import NavItem from './NavItem';

function Navigation() {
  const navLinkList = getNavLinkList();
  return (
    <div className='bg-white flex flex-row items-center justify-evenly'>
      {navLinkList.map(nav => (
        <div key={nav.pathName} className='py-2'>
          <NavItem item={nav} />
        </div>
      ))}
    </div>
  );
}

export default Navigation;
