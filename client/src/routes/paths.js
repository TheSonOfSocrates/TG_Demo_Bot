// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/login',
  register: '/register',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  one: path(ROOTS_DASHBOARD, '/one'),
  two: path(ROOTS_DASHBOARD, '/two'),
  three: path(ROOTS_DASHBOARD, '/three'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    four: path(ROOTS_DASHBOARD, '/user/four'),
    five: path(ROOTS_DASHBOARD, '/user/five'),
    six: path(ROOTS_DASHBOARD, '/user/six'),
  },
  flight: {
    root: path(ROOTS_DASHBOARD, '/flight'),
    list: path(ROOTS_DASHBOARD, '/flight/list'),
    // list_all: path(ROOTS_DASHBOARD, '/flight/list'),
    create: path(ROOTS_DASHBOARD, '/flight/create'),
    view: (id) => path(ROOTS_DASHBOARD, `/flight/${id}`),
  },
};
