import React from 'react';
import syncIcon from '../../icons/sync.svg';
import './styles.scss';

const SyncButton = ({ syncing, onSync }) => {
  return (
    <div role="button" onClick={onSync} className="sync-btn">
      <img
        src={syncIcon}
        width={20}
        alt="Sync"
        className={syncing ? 'rotate' : 'rotate-once'}
      />
    </div>
  );
};

export default SyncButton;
