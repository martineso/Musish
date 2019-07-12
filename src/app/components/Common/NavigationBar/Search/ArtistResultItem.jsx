import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import * as PropTypes from 'prop-types';
import classes from './SearchBar.scss';

function ArtistResultItem({ artist }) {
  const link = isNaN(artist.id) ? `/me/artists/${artist.id}` : `/artist/${artist.id}`;
  const isCatalog = artist.type === 'artists';

  return (
    <Link to={link}>
      <div className={cx(classes.result, classes.artist)}>
        {isCatalog && <i className={'fab fa-apple'} />}
        <span className={classes.name}>{artist.attributes.name}</span>
      </div>
    </Link>
  );
}

ArtistResultItem.propTypes = {
  artist: PropTypes.any.isRequired,
};

export default ArtistResultItem;
