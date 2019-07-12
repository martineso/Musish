import React from 'react';
import PropTypes from 'prop-types';
import Player from '../Player/Player';
import classes from './Sidebar.scss';
import PlaylistMenuItem from './Menu/MenuItem/PlaylistMenuItem';
import withMK from '../../../hoc/withMK';
import withContext from '../../../hoc/withContext';
import SidebarMenu from './Menu/SidebarMenu';
import SidebarLibraryMenu from './Menu/SidebarLibraryMenu';
import { AuthorizeContext } from '../../Providers/AuthorizeProvider';
import InfiniteLoader from '../InfiniteLoader/InfiniteLoader';
import translate from '../../../utils/translations/Translations';
import { usePlaylists } from '../../Providers/PlaylistsProvider';

function Sidebar(props) {
  const { authorized } = props;

  const playlistsData = usePlaylists();

  async function loadPlaylists(params) {
    const music = MusicKit.getInstance();

    return music.api.library.playlists(null, params);
  }

  function renderPlaylists(args, { items }) {
    return items.map(playlist => (
      <PlaylistMenuItem
        playlist={playlist}
        to={`/me/playlists/${playlist.id}`}
        label={playlist.attributes.name}
        key={playlist.id}
      />
    ));
  }

  const appleMusic = authorized ? (
    <SidebarMenu
      title={translate.appleMusic}
      items={[
        { to: '/', label: translate.forYou },
        { to: '/browse', label: translate.browse, exact: false },
        { to: '/radio', label: translate.radio },
      ]}
    />
  ) : (
    <SidebarMenu
      title={translate.appleMusic}
      items={[{ to: '/browse', label: translate.browse }, { to: '/radio', label: translate.radio }]}
    />
  );

  return (
    <aside className={classes.sidebar}>
      <div className={classes.menus}>
        {appleMusic}
        {authorized && (
          <SidebarLibraryMenu
            title={translate.myLibrary}
            items={[
              { to: '/me/added', label: translate.recentlyAdded, exact: false },
              { to: '/me/artists', label: translate.artists, exact: false },
              { to: '/me/albums', label: translate.albums, exact: false },
              { to: '/me/songs', label: translate.songs },
              { to: '/me/playlists', label: translate.playlists },
            ]}
          />
        )}
        {authorized && (
          <div className={classes.menu}>
            <h3>{translate.playlists}</h3>
            <ul>
              <InfiniteLoader
                load={loadPlaylists}
                render={renderPlaylists}
                loadAll
                onSetItems={({ items }) => playlistsData.setItems(items)}
              />
            </ul>
          </div>
        )}
        <div className={classes.footer}>
          <span>
            <a href={'https://github.com/Musish/Musish/issues/new/choose'} target={'_blank'}>
              {translate.feedback}
            </a>
            {' & '}
            <a href={'https://github.com/Musish/Musish'} target={'_blank'}>
              GitHub
            </a>
          </span>
          <span className={classes.footnote}>
            {translate.formatString(translate.designCredits, <i className={'fa fa-heart'} />)}
          </span>
        </div>
      </div>
      <Player />
    </aside>
  );
}

Sidebar.propTypes = {
  authorized: PropTypes.bool.isRequired,
};

export default withMK(withContext(Sidebar, AuthorizeContext));
