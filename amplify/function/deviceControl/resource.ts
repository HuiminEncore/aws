import { defineFunction } from '@aws-amplify/backend';

export const deviceControl = defineFunction({
    name: 'device-control',
    entry: './handler.ts'
});
