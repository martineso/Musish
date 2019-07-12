import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import classes from './ArtistPage.scss';
import PageTitle from '../../../Common/PageTitle/PageTitle';
import PageContent from '../../../Common/PageContent/PageContent';
import AlbumItem from '../../../Common/AlbumItem/AlbumItem';
import backend from '../../../../services/Backend';
import translate from '../../../../utils/translations/Translations';
import PlaylistItem from '../../../Common/PlaylistItem/PlaylistItem';

class ArtistPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      artist: null,
      geniusData: null,
    };

    this.pageRef = React.createRef();
  }

  componentDidMount() {
    this.refreshData();
  }

  componentDidUpdate() {
    if (this.state.artist && this.state.artist.id !== this.props.match.params.id) {
      this.refreshData();
    }
  }

  fetchArtist = async () => {
    const music = MusicKit.getInstance();

    const { id } = this.props.match.params;
    const isCatalog = /^\d+$/.test(id);

    let artist;
    if (isCatalog) {
      artist = await music.api.artist(id);
    } else {
      artist = await music.api.library.artist(id);
    }

    this.setState({
      artist,
    });
  };

  fetchAlbums = async () => {
    const music = MusicKit.getInstance();

    const { id } = this.props.match.params;
    const isCatalog = /^\d+$/.test(id);

    let albums;
    if (isCatalog) {
      albums = await music.api.artist(id, { include: 'albums' });
    } else {
      albums = await music.api.library.artist(id, { include: 'albums' });
    }

    this.setState({
      albums,
    });
  };

  fetchPlaylists = async () => {
    const music = MusicKit.getInstance();

    const { id } = this.props.match.params;
    const isCatalog = /^\d+$/.test(id);

    let playlists;
    if (isCatalog) {
      playlists = await music.api.artist(id, { include: 'playlists' });
    }

    this.setState({
      playlists,
    });
  };

  fetchGeniusData = async () => {
    const { id } = this.props.match.params;

    const isCatalog = /^\d+$/.test(id);
    if (!isCatalog) {
      return;
    }

    const { data } = await backend.get(`/genius/artist?artistId=${id}`);
    data.plainDescription = ArtistPage.flattenDesc(data.description.dom.children);

    this.setState({
      geniusData: data,
    });
  };

  static flattenDesc(object, props = {}) {
    if (typeof object === 'string') {
      return object;
    }

    if (Array.isArray(object)) {
      return object.map((child, i) => ArtistPage.flattenDesc(child, { key: i }));
    }

    const { attributes } = object;
    if (object.tag === 'a') {
      attributes.target = '_blank';
    }

    return React.createElement(
      object.tag,
      { ...attributes, ...props },
      ArtistPage.flattenDesc(object.children),
    );
  }

  refreshData = () => {
    this.fetchArtist();
    this.fetchAlbums();
    this.fetchPlaylists();
    this.fetchGeniusData();
  };

  render() {
    const { artist, albums, playlists, geniusData } = this.state;

    const headerStyles = {
      background: geniusData ? `url(${geniusData.header_image_url})` : '#f2f2f2',
    };
    const imageStyles = {
      background: geniusData ? `url(${geniusData.image_url})` : '#ffffff',
    };

    return (
      <PageContent innerRef={this.pageRef}>
        {geniusData && (
          <div className={classes.artistHeader} style={headerStyles}>
            <a href={'https://genius.com/'} target={'_blank'}>
              <div className={classes.geniusCredit}>
                <span>{translate.dataProvidedByGenius}</span>
              </div>
            </a>
            <div className={classes.artistHeaderContainer}>
              <div className={classes.artistHeaderPicture} style={imageStyles} />
            </div>
          </div>
        )}

        <PageTitle title={artist ? artist.attributes.name : '...'} context={'Apple Music'} />
        {geniusData && geniusData.plainDescription}

        {albums && (
          <>
            <h3>{translate.albums}</h3>

            <div className={classes.albumsGrid}>
              {albums.map(album => (
                <AlbumItem key={album.id} album={album} size={120} />
              ))}
            </div>
          </>
        )}

        {playlists && (
          <>
            <h3>{translate.playlists}</h3>

            <div className={classes.playlistsGrid}>
              {playlists.map(playlist => (
                <PlaylistItem key={playlist.id} playlist={playlist} size={120} />
              ))}
            </div>
          </>
        )}
      </PageContent>
    );
  }
}

ArtistPage.propTypes = {
  match: PropTypes.any.isRequired,
};

export default withRouter(ArtistPage);
