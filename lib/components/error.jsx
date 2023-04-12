import * as Uebersicht from 'uebersicht';
import * as Settings from './settings/settings.jsx';
import * as Utils from '../utils';

const message = {
  error: 'Something went wrong...',
  yabaiError: 'yabai is not running',
  noOutput: 'Loading...',
  noData: 'JSON error...',
};

export const Component = ({ type, classes }) => {
  const errorClasses = Utils.classnames('simple-bar--empty', classes, {
    'simple-bar--loading': type === 'noOutput',
  });
  Uebersicht.React.useEffect(() => {
    const timers = [];
    if (type === 'error' || type === 'noData') {
      timers.push(setTimeout(Utils.softRefresh, 2000));
    }
    if (type === 'yabaiError') {
      timers.push(setTimeout(Utils.softRefresh, 15000));
    }
    return () => {
      timers.forEach((i) => clearTimeout(i));
    };
  }, []);

  return (
    <div className={errorClasses}>
      <span>simple-bar-index.jsx: {message[type]}</span>
      <Settings.Wrapper />
    </div>
  );
};
