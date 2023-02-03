import config from '../../config';
import env from '../../env';

export default {
  appCode: parseAppInfo,
  currentUser: parseUser,
  users: parseUsers,
  deal: parseDeal,
  task: parseTask,
  placementList: parsePlacementList,
};

function parseTask({ tasks }) {
  return tasks[0];
}

function parseDeal(deals) {
  const [deal] = deals;

  if (deal) {
    return {
      id: deal.ID,
      title: deal.TITLE,
      url: `/crm/deal/details/${deal.ID}/`,
      assignedId: deal.ASSIGNED_BY_ID,
    };
  }

  return null;
}

function parseAppInfo(info) {
  return info.CODE;
}

function parseUsers(users) {
  return users.reduce((list, user) => {
    list[user.ID] = parseUser(user);
    return list;
  }, {});
}

function parseUser(user) {
  const { ID, NAME, LAST_NAME } = user;
  const name = NAME || LAST_NAME ? [NAME, LAST_NAME].join(' ') : `Пользователь с ID ${ID}`;
  return {
    id: ID,
    name,
  };
}

function parsePlacementList(placementList) {
  function getItem(placement, name, bind = false) {
    return { placement, name: name || config.global.appName, bind };
  }
  const defaultPlacement = env.get('PLACEMENT').reduce((acc, placement) => {
    acc[placement] = getItem(placement);
    return acc;
  }, {});
  const realPlacement = placementList.reduce((acc, item) => {
    acc[item.placement] = getItem(item.placement, item.title, true);
    return acc;
  }, {});

  return {
    ...defaultPlacement,
    ...realPlacement,
  };
}
