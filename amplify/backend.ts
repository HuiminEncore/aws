import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource.js';
import { data } from './data/resource.js';
import { deviceControl } from './function/deviceControl/resource';

defineBackend({
  auth,
  data,
  deviceControl,
});
