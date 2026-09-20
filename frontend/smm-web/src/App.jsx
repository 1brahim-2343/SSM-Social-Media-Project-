import AppRoutes from './routes/AppRoutes';

import useNotificationSignalR from './features/notifications/hooks/useNotificationsSignalR';

export default function App() {
  useNotificationSignalR();

  return <AppRoutes />;
}