import argon from 'argon2';

export const hash = argon.hash;
export const verify = argon.verify;
