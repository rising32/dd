export const userURL = {
  login: '/user/login',
  signout: '/user/logout',
  updateUser: '/user/update',
};

export const clientURL = {
  getMyClients: '/admin/get_my_clients',
  createClient: '/admin/create_client',
  registerMyClient: '/admin/regist_my_client',
  updateClient: '/admin/update_client',
};

export const projectURL = {
  createProject: '/project/create',
  updateProject: '/project/update',
  getUserProject: '/project/get_user_projects',
  getProjectWithClientId: '/project/get/client_no_assign',
  setClient: '/project/set_Client',
  getWeekStaticsticsData: '/project/get_real_workdays/week/client',
  getMonthStaticsticsData: '/project/get_real_workdays/month/client',
};

export const taskURL = {
  createTask: '/project/task/create',
  updateTask: '/project/task/update',
  getUserTask: '/project/task/get_user_tasks',
  getTaskListWithProjectId: '/project/task/get_by_pna',
};

export const teamURL = {
  getTeamMember: '/team/get_team_members',
};

export const priorityURL = {
  createPriority: '/priority/create',
  updatePriority: '/priority/update',
  getPriorityByWeek: '/priority/get/userid/week',
  getPastNotAchievedPriorities: '/priority/get/userid/week/before/not_completed',
  getMyBeforePriorities: '/priority/get/userid/week/before',
};

export const deliverableURL = {
  createDeliverable: '/project/deliverable/create',
  updateDeliverable: '/project/deliverable/update',
  getDeliverablesWithPlanedDate: '/project/deliverable/get/planned_end_date',
  deliverableInfo: '/project/deliverable/get_cpt_by_id',
};
