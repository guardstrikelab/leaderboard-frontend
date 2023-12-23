import service from './index';

// 创建team
export const createTeam = (data) =>
  service({
    method: 'post',
    url: '/api/participants/participant_team',
    data,
  });

// 查询team
export const getTeam = (params) =>
  service({
    method: 'get',
    url: '/api/participants/participant_team',
    params,
  });

// 更新team
export const updateTeam = (id, data) =>
  service({
    method: 'PATCH',
    url: `/api/participants/participant_team/${id}`,
    data,
  });

// 从队伍中移除自己
export const removeSelf = (id) =>
  service({
    method: 'delete',
    url: `/api/participants/remove_self_from_participant_team/${id}`,
  });

// 邀请成员
export const inviteMember = (id, data) =>
  service({
    method: 'post',
    url: `/api/participants/participant_team/${id}/invite`,
    data,
  });
