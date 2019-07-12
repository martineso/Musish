import React from 'react';
import PropTypes from 'prop-types';
import classes from '../Sidebar.scss';
import MenuItem from './MenuItem/MenuItem';

function SidebarMenu(props) {
  const { title, items } = props;

  return (
    <div className={classes.menu}>
      <h3>{title}</h3>
      <ul>
        {items.map(item => (
          <MenuItem {...item} key={item.to} />
        ))}
      </ul>
    </div>
  );
}

SidebarMenu.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
};

export default SidebarMenu;
