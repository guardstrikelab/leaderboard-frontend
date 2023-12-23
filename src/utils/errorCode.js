import i18n from '@/lang/index.js';
export default {
  401: '认证失败，无法访问系统资源',
  403: '当前操作没有权限',
  404: '访问资源不存在',
  default: '系统未知错误，请反馈给管理员',
};

// 错误信息
export const errorMsg = [
  { zh: '该用户名已经存在。', en: 'A user with that username already exists.' },
  { zh: '此电子邮件地址已被注册。', en: 'A user is already registered with this e-mail address.' },
  { zh: '两个密码字段不匹配。', en: "The two password fields didn't match." },
  { zh: '无法使用提供的凭据登录。', en: 'Unable to log in with provided credentials.' },
  { zh: '这个密码过于简单。', en: 'This password is too common.' },
  { zh: '此密码完全是数字。', en: 'This password is entirely numeric.' },
  { zh: '无效密码', en: 'Invalid password' },
  { zh: '不存在给定电子邮件的用户。', en: 'User with the given email does not exist.' },
  { zh: '您无权更改团队详细信息！', en: 'You are not a authorized to change team details!' },
  { zh: '此团队名称已存在。', en: 'participant team with this team name already exists.' },
  { zh: '请输入一个有效地址。', en: 'Enter a valid URL.' },
  { zh: '用户处于非活动状态或已删除', en: 'User inactive or deleted' },
  { zh: '该用户已经是团队的一员！', en: 'User is already part of the team!' },
  { zh: '很抱歉，您无法删除此团队，因为它已参加挑战！', en: 'Sorry, you cannot delete this team since it has taken part in challenge(s)!' },
  { zh: '此电子邮件地址的用户不存在！', en: 'User does not exist with this email address!' },
  { zh: '请确保此字段的字符数不超过1000个。', en: 'Ensure this field has no more than 1000 characters.' },
  { zh: '此字段为必填字段。', en: 'This field is required.' },
  { zh: '团队尚未参加挑战', en: 'Team has not participated in the challenge' },
  { zh: '很抱歉，您没有删除此参与者团队的权限', en: 'Sorry, you do not have permissions to remove this participant team' },
  { zh: '请求被阻止。预计2751秒后可用。', en: 'Request was throttled. Expected available in 2751 seconds.' },
  {
    zh: '很抱歉，其他团队成员已经参加了挑战。请加入其他团队！',
    en: 'Sorry, other team member(s) have already participated in the Challenge. Please participate with a different team!',
  },
  { zh: '比赛不存在', en: 'Challenge does not exist' },
  { zh: '比赛不存在', en: 'Challenge does not exist!' },
  { zh: '您无权提出此请求', en: 'You are not authorized to make this request' },
  { zh: '队伍名已被占用！', en: 'The team name has already be used!' },
  { zh: '已提交参赛作品的参赛队伍不能被取消注册。', en: 'Participant teams which have made submissions to a challenge cannot be deregistered.' },
  { zh: '比赛未开始', en: 'Challenge is not active' },
  { zh: '团队已存在', en: 'Team already exists' },
  { zh: '抱歉，比赛已被移除!', en: 'Sorry, the challenge was removed!' },
  { zh: '抱歉，排行榜是不公开的!', en: 'Sorry, the leaderboard is not public!' },
  { zh: '您还没有参加比赛', en: "You haven't participated in the challenge" },
  { zh: '您不是参与者!', en: 'You are not a participant!' },
  { zh: '在同一比赛中代号的字段必须是唯一的', en: 'The fields codename, challenge must make a unique set.' },
  { zh: '您不是这个团队的一员!', en: 'You are not a member of this team!' },
  { zh: '只有失败的提交才能恢复', en: 'Only failed submissions can be resumed' },
  { zh: '只有比赛管理员被允许重新运行提交', en: 'Only challenge hosts or admins are allowed to re-run a submission' },
];

export function getErrMsg(msg) {
  if (i18n.global.locale.value === 'zh') {
    for (let i = 0; i < errorMsg.length; i++) {
      if (errorMsg[i].en === msg) {
        return errorMsg[i].zh;
      }
    }
  }
  return msg;
}
