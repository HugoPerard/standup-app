import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import localeData from 'dayjs/plugin/localeData';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('fr');
dayjs.extend(customParseFormat);
dayjs.extend(localeData);
dayjs.extend(relativeTime);
