import env from '@/env';

export default {
  info: parseAppInfo,
  currentUser: parseUser,
  users: parseUsers,
  deal: parseDeal,
  task: parseTask,
  placementList: parsePlacementList,
};

function parseTask({ tasks }: { tasks: any[] }) {
  return tasks[0];
}

function parseDeal(deals: any[]) {
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

function parseAppInfo(info: { CODE: string }) {
  return info.CODE;
}

function parseUsers(users: any[]) {
  return users.reduce((list, user) => {
    list[user.ID] = parseUser(user);
    return list;
  }, {});
}

function parseUser(user: any) {
  const { ID, NAME, LAST_NAME } = user;
  const name = NAME || LAST_NAME ? [NAME, LAST_NAME].join(' ') : `Пользователь с ID ${ID}`;
  return {
    id: ID,
    name,
  };
}

function parsePlacementList(placementList: any[]) {
  function getItem(placement: string, name: string = '', bind = false) {
    return { placement, name: name || env.get('APP_NAME'), bind };
  }
  const defaultPlacement = env.get('PLACEMENT').reduce((acc: any, placement: string) => {
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
