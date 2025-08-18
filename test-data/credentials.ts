export const invalidCredentials = {
  wrongPassword: {
    email: 'test@gmail.com',
    password: 'WrongPassword123!'
  },
  wrongEmail: {
    email: 'test@example.com',
    password: 'wrong123'
  },
  nonExistentUser: {
    email: 'invalid@test.com',
    password: 'TestPass123!'
  },
  incorrectPassword: {
    email: 'user@domain.com',
    password: 'IncorrectPwd!'
  }
};

export const invalidEmails = {
  noAtSymbol: {
    email: 'notanemail',
    password: 'ValidPassword123!'
  },
  noDomain: {
    email: 'missing@domain',
    password: 'ValidPassword123!'
  },
  noLocalPart: {
    email: '@nodomain.com',
    password: 'ValidPassword123!'
  },
  withSpaces: {
    email: 'spaces in@email.com',
    password: 'ValidPassword123!'
  }
};