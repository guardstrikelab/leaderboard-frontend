import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../layout/Index.vue';
import i18n from '@/lang/index.js';
import store from '../store';
const redirect = store.state.token ? '/challenge' : '/challenge/home';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: Layout,
      redirect: redirect,
      children: [
        {
          path: '/challenge',
          name: 'Challenge',
          meta: { title: i18n.global.t('challenge.challenge') },
          children: [
            {
              path: '',
              name: 'ChallengeIndex',
              component: () => import('../views/challenge/Challenge.vue'),
            },
            {
              path: 'detail/:challengeId',
              component: () => import('../views/challenge/Detail.vue'),
              name: 'EventDetail',
              meta: {
                title: i18n.global.t('challenge.eventDetails'),
                showcrumb: true,
                activeMenu: '/challenge',
              },
            },
            {
              path: 'home',
              component: () => import('../views/challenge/Home.vue'),
              name: 'ChallengeHome',
              meta: {
                title: i18n.global.t('challenge.eventDetails'),
                showcrumb: true,
                activeMenu: '/challenge',
              },
            },
          ],
        },
        {
          path: '/team',
          component: () => import('../views/team/Team.vue'),
          name: 'Team',
          meta: { title: i18n.global.t('team.team') },
        },
        {
          path: '/host',
          name: 'Host',
          meta: {
            title: i18n.global.t('host.hostchall'),
            showcrumb: true,
          },
          children: [
            {
              path: '',
              name: 'HostIndex',
              component: () => import('../views/host/Index.vue'),
            },
            {
              path: 'challenge/add',
              component: () => import('../views/host/AddChallenge.vue'),
              name: 'AddChallenge',
              meta: {
                title: i18n.global.t('addChall.createChall'),
                showcrumb: true,
                activeMenu: '/host',
              },
            },
            {
              path: 'challenge/:challengeId',
              component: () => import('../views/host/ChallengeDetail.vue'),
              name: 'ChallengeDetail',
              meta: {
                title: i18n.global.t('challenge.eventDetails'),
                showcrumb: true,
                activeMenu: '/host',
              },
            },
            {
              path: 'challenge/edit/:challengeId',
              component: () => import('../views/host/AddChallenge.vue'),
              name: 'EditChallenge',
              meta: {
                title: i18n.global.t('addChall.editChall'),
                showcrumb: true,
                activeMenu: '/host',
              },
            },
            {
              path: 'phase/add/:challengeId',
              component: () => import('../views/host/AddPhase.vue'),
              name: 'AddPhase',
              meta: {
                title: i18n.global.t('addPhase.createPhase'),
                showcrumb: true,
                activeMenu: '/host',
              },
            },
            {
              path: 'phase/edit/:challengeId/:phaseId',
              component: () => import('../views/host/AddPhase.vue'),
              name: 'EditPhase',
              meta: {
                title: i18n.global.t('addPhase.editPhase'),
                showcrumb: true,
                activeMenu: '/host',
              },
            },
          ],
        },
        {
          path: '/profile',
          component: () => import('../views/user/Profile.vue'),
          name: 'User',
          meta: { title: i18n.global.t('user.profile') },
        },
        {
          path: '/permissionDenied',
          component: () => import('../views/permission/Denied.vue'),
          name: 'Permission',
          meta: { title: i18n.global.t('permission.denied') },
        },
      ],
    },
    {
      path: '/auth',
      component: () => import('../views/auth/Index.vue'),
      children: [
        {
          path: 'login',
          name: 'Login',
          component: () => import('../views/auth/Login.vue'),
        },
        {
          path: 'signup',
          name: 'Signup',
          component: () => import('../views/auth/Signup.vue'),
        },
        {
          path: 'forget',
          name: 'Forget',
          component: () => import('../views/auth/Forget.vue'),
        },
        {
          path: 'resetcode/:uid/:token',
          name: 'Resetcode',
          component: () => import('../views/auth/Resetcode.vue'),
        },
        {
          path: 'verifyEmail',
          name: 'VerifyEmail',
          component: () => import('../views/auth/VerifyEmail.vue'),
        },
      ],
    },
  ],
});

export default router;
