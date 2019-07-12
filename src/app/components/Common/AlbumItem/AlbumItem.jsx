import React from 'react';

import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { DragSource } from 'react-dnd';
import cx from 'classnames';
import classes from './AlbumItem.scss';
import AlbumPanel from '../AlbumPanel/AlbumPanel';
import DragDropType from '../../../utils/Constants/DragDropType';
import ContextMenuTrigger from '../ContextMenu/ContextMenuTrigger';
import AlbumContextMenu from '../ContextMenu/Types/Album/AlbumContextMenu';
import { useModal } from '../../Providers/ModalProvider';

function AlbumItem(props) {
  const { push: pushModal } = useModal();

  function handleOpen(replace) {
    const id = props.id || props.album.id;

    if (props.navigate) {
      props.history.push(`/me/album/${id}`);
    } else {
      replace(<AlbumPanel key={id} id={id} pseudoRoute />);
    }
  }

  const { album, size, connectDragSource, isOver } = props;
  const artwork = MusicKit.formatArtworkURL(album.attributes.artwork, size, size);

  const explicit = album.attributes.contentRating === 'explicit' && (
    <div className={classes.explicit}>
      <span>E</span>
    </div>
  );

  return connectDragSource(
    <div className={cx(classes.container, { [classes.droppable]: isOver })} style={{ width: size }}>
      <div onClick={() => handleOpen(pushModal)}>
        <ContextMenuTrigger holdToDisplay={-1} render={() => <AlbumContextMenu album={album} />}>
          <div className={classes.imageContainer} style={{ width: size, height: size }}>
            <img
              src={artwork}
              className={classes.image}
              style={{ width: size, height: size }}
              alt={album.attributes.name}
              title={album.attributes.name}
            />
          </div>

          <div className={classes.descriptionContainer}>
            <span className={classes.albumTitle} style={{ width: size }}>
              <div className={classes.albumName}>{album.attributes.name}</div>
              {explicit}
            </span>
            <span className={classes.artistName} style={{ width: size }}>
              {album.attributes.artistName}
            </span>
          </div>
        </ContextMenuTrigger>
      </div>
    </div>,
  );
}

AlbumItem.propTypes = {
  navigate: PropTypes.bool,
  history: PropTypes.any.isRequired,
  album: PropTypes.any,
  id: PropTypes.any,
  size: PropTypes.number.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  isOver: PropTypes.bool,
};

AlbumItem.defaultProps = {
  navigate: false,
  album: null,
  id: null,
  isOver: false,
};

const dndSpec = {
  beginDrag(props) {
    return {
      album: props.id || props.album.id,
    };
  },
};

function dndCollect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export default DragSource(DragDropType.ALBUM, dndSpec, dndCollect)(withRouter(AlbumItem));
