import service from './index';

// 参加比赛
export const partChallenge = (challengeId, teamId) =>
  service({
    method: 'post',
    url: `/api/challenges/challenge/${challengeId}/participant_team/${teamId}`,
  });

// 取消报名
export const deregisterChallenge = (challengeId) =>
  service({
    method: 'post',
    url: `/api/challenges/challenge/${challengeId}/deregister/`,
  });

// 参加比赛的团队
export const challengeTeam = (challengeId) =>
  service({
    method: 'get',
    url: `/api/challenges/${challengeId}/participant_team/team_detail`,
  });

// 查询phase
export const challengePhase = (challengeId) =>
  service({
    method: 'get',
    url: `/api/challenges/challenge/${challengeId}/challenge_phase`,
  });

// 查询提交列表
export const getSubmission = (challengeId, phaseId, params) =>
  service({
    method: 'get',
    url: `/api/jobs/challenge/${challengeId}/challenge_phase/${phaseId}/submission/`,
    params,
  });

// 更新提交列表
export const updateSubmission = (challengeId, phaseId, submisId, data) =>
  service({
    method: 'PATCH',
    url: `/api/jobs/challenge/${challengeId}/challenge_phase/${phaseId}/submission/${submisId}`,
    data,
  });

// 获取赛道
export const getPhaseSplit = (challengeId) =>
  service({
    method: 'get',
    url: `/api/challenges/${challengeId}/challenge_phase_split`,
  });

// 获取排行榜
export const getLeaderboard = (splitId, params) =>
  service({
    method: 'get',
    url: `/api/jobs/challenge_phase_split/${splitId}/leaderboard/`,
    params,
  });

// 获取所有团队
export const getParticipantTeams = (challengeId) =>
  service({
    method: 'get',
    url: `/api/challenges/challenge/${challengeId}/get_participant_teams/`,
  });

// 查询比赛详情
export const getChallengeDetail = (challengeId) =>
  service({
    method: 'get',
    url: `/api/challenges/challenge/${challengeId}/`,
  });

// 查询用户的比赛权限
export const getChallengeUser = (challengeId) =>
  service({
    method: 'get',
    url: `/api/participants/participant_teams/challenges/${challengeId}/user`,
  });

// 团队审核通过
export const approveTeam = (challengeId, teamId) =>
  service({
    method: 'post',
    url: `/api/challenges/challenge/${challengeId}/approve_participant_team/${teamId}`,
  });

// 团队审核不通过
export const disapproveTeam = (challengeId, teamId) =>
  service({
    method: 'post',
    url: `/api/challenges/challenge/${challengeId}/disapprove_participant_team/${teamId}`,
  });

// 查询某个阶段的所有提交
export const getAllSubmissions = (challengeId, phaseId) =>
  service({
    method: 'get',
    url: `/api/challenges/${challengeId}/challenge_phase/${phaseId}/submissions`,
  });

// 取消正在执行的任务
export const updateSubmissionMeta = (challengeId, submissionId, data) =>
  service({
    method: 'patch',
    url: `/api/jobs/challenges/${challengeId}/submissions/${submissionId}/update_submission_meta/`,
    data,
  });

// 重新执行执行任务
export const reRunSubmission = (submission_pk) =>
  service({
    method: 'post',
    url: `/api/jobs/submissions/${submission_pk}/re-run/`,
  });

// 继续执行执行任务
export const resumeSubmission = (submission_pk) =>
  service({
    method: 'post',
    url: `/api/jobs/submissions/${submission_pk}/resume/`,
  });

// 获取宣传的比赛详情
export const getChallengeHomeDetail = () =>
  service({
    method: 'get',
    url: `/api/challenges/home`,
    headers: {
      noMessage: true,
      isToken: false,
    },
  });

// 查询已参加的比赛
export const getParticipatedChallenge = () =>
  service({
    method: 'get',
    url: `/api/participants/participant_teams/user`,
    headers: {
      noMessage: true,
    },
  });
