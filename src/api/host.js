import service from './index';
const challenge_host_team_pk = 1;

// 创建比赛
export const createChallenge = (data) =>
  service({
    method: 'post',
    url: `/api/challenges/challenge/challenge_host_team/${challenge_host_team_pk}/create_or_update_challenge/`,
    data,
  });

/**
 * 查询比赛
 * @param {*} challenge_time "all", "future", "past", "present"
 * @param {*} challenge_approved "all", "approved", "unapproved"
 * @param {*} challenge_published "all", "public", "private"
 */
export const getAllChallenges = (challenge_time, challenge_approved, challenge_published, params) =>
  service({
    method: 'get',
    url: `/api/challenges/challenge/${challenge_time}/${challenge_approved}/${challenge_published}`,
    params,
  });

// 创建phase
export const createPhase = (challenge_pk, data) =>
  service({
    method: 'post',
    url: `/api/challenges/challenge/challenge_host_team/${challenge_host_team_pk}/challenges/${challenge_pk}/create_or_update_challenge_phase/`,
    data,
  });

// 验证当前用户是否是host用户
export const verifyHostUser = () =>
  service({
    method: 'get',
    url: `/api/hosts/challenge_host/verify_user`,
    headers: {
      noMessage: true,
    },
  });

// 查询phase详情
export const getPhaseDetail = (challenge_pk, id) =>
  service({
    method: 'get',
    url: `/api/challenges/challenge/${challenge_pk}/challenge_phase/${id}`,
  });

// 删除challenge比赛
export const delChallenge = (challenge_pk) =>
  service({
    method: 'delete',
    url: `/api/challenges/challenge_host_team/${challenge_host_team_pk}/challenge/${challenge_pk}`,
  });

// 删除Phase
export const delPhase = (challenge_pk, id) =>
  service({
    method: 'delete',
    url: `/api/challenges/challenge/${challenge_pk}/challenge_phase/${id}`,
  });
