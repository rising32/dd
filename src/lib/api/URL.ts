export const userURL = {
  login: '/user/login',
};

export const clientURL = {
  getMyClients: '/admin/get_my_clients',
};

export const projectURL = {
  getUserProject: '/project/get_user_projects',
  getProjectWithClientId: '/project/get/client_no_assign',
  setClient: '/project/set_Client',
};

export const taskURL = {
  updateTask: '/project/task/update',
  getTaskListWithProjectId: '/project/task/get_by_pna',
};

export const teamURL = {
  getTeamMember: '/team/get_team_members',
};

export const priorityURL = {
  createPriority: '/priority/create',
  getPriorityByWeek: '/priority/get/userid/week',
  getPastNotAchievedPriorities: '/priority/get/userid/week/before/not_completed',
};
