import update from '../../functions/update';

const mapping = [
  {
    key: [
      {
        name: 'firstName',
        kind: 'STRING',
      },
    ],
    value: 'Doe',
  },
  {
    key: [
      {
        name: 'lastName',
        kind: 'STRING',
      },
    ],
    value: 'John',
  },
  {
    key: [
      {
        name: 'age',
        kind: 'INTEGER',
      },
    ],
    value: 40,
  },
];

describe('Native update', () => {
  test('It updates the primitive properties of a record', async () => {
    const { as: result } = await update({
      selectedRecord: {
        data: { id: 1 },
        model: { name: 'User' },
      },
      mapping,
    });
    expect(result).toMatchObject({
      firstName: 'Doe',
      lastName: 'John',
      age: 40,
    });
  });

  test('It updates a belongs to relation based on a record variable', async () => {
    const { as: result } = await update({
      selectedRecord: {
        data: { id: 1 },
        model: { name: 'User' },
      },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'city',
              kind: 'BELONGS_TO',
            },
          ],
          value: {
            id: 2,
            name: 'London',
          },
        },
      ],
    });
    expect(result).toMatchObject({
      firstName: 'Doe',
      lastName: 'John',
      age: 40,
      city: {
        id: 2,
        name: 'London',
      },
    });
  });

  test('It updates a belongs to relation based on a number variable', async () => {
    const { as: result } = await update({
      selectedRecord: {
        data: { id: 1 },
        model: { name: 'User' },
      },
      mapping: [
        ...mapping,
        {
          key: [
            {
              name: 'city',
              kind: 'BELONGS_TO',
            },
          ],
          value: 2,
        },
      ],
    });
    expect(result).toMatchObject({
      firstName: 'Doe',
      lastName: 'John',
      age: 40,
      city: {
        id: 2,
      },
    });
  });

  test('It updates a record without mapping', async () => {
    const { as: result } = await update({
      selectedRecord: {
        data: { id: 1 },
        model: { name: 'User' },
      },
      mapping: [],
    });
    expect(result).toMatchObject({
      id: 1,
    });
  });

  test('It throws an error for missing id', async () => {
    try {
      await update({
        selectedRecord: {
          data: {},
          model: { name: 'User' },
        },
        mapping,
      });
    } catch (errors) {
      expect(errors.length).toEqual(1);
    }
  });
});
