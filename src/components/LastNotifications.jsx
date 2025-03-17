import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const LastNotifications = ({ latestNotifications }) => {
  const h2Style = "text-xl font-semibold";
  const liStyle = "flex items-center";

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center mb-4">
        <FontAwesomeIcon
          icon={faBell}
          className="mr-4 text-3xl text-blue-500"
        />
        <h2 className={h2Style}>Latest Notifications</h2>
      </div>
      <ul className="space-y-2">
        {latestNotifications?.map((notification) => (
          <li key={notification.id} className={liStyle}>
            <FontAwesomeIcon icon={faBell} className="mr-2 text-blue-500" />
            {notification.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LastNotifications;
