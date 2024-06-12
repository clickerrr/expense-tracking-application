const expenseList = [
    {
        "id": 1,
        "name": "Expense: 1",
        "date": "2022-05-02T11:17:23.226Z",
        "category": "Food",
        "amount": 7252
    },
    {
        "id": 2,
        "name": "Expense: 2",
        "date": "2023-11-06T11:23:09.350Z",
        "category": "Grocery",
        "amount": 202
    },
    {
        "id": 3,
        "name": "Expense: 3",
        "date": "2022-08-13T06:06:25.053Z",
        "category": "Subscriptions",
        "amount": 7230
    },
    {
        "id": 4,
        "name": "Expense: 4",
        "date": "2020-11-30T15:07:17.241Z",
        "category": "Personal",
        "amount": 5406
    },
    {
        "id": 5,
        "name": "Expense: 5",
        "date": "2022-01-23T00:09:52.249Z",
        "category": "Subscriptions",
        "amount": 6133
    },
    {
        "id": 6,
        "name": "Expense: 6",
        "date": "2024-04-09T07:13:20.373Z",
        "category": "Grocery",
        "amount": 8839
    },
    {
        "id": 7,
        "name": "Expense: 7",
        "date": "2022-11-14T23:36:42.825Z",
        "category": "Personal",
        "amount": 9871
    },
    {
        "id": 8,
        "name": "Expense: 8",
        "date": "2021-12-01T14:50:16.699Z",
        "category": "Subscriptions",
        "amount": 2038
    },
    {
        "id": 9,
        "name": "Expense: 9",
        "date": "2021-03-22T01:33:14.225Z",
        "category": "Personal",
        "amount": 5902
    },
    {
        "id": 10,
        "name": "Expense: 10",
        "date": "2021-06-16T16:33:02.224Z",
        "category": "Gas",
        "amount": 866
    },
    {
        "id": 11,
        "name": "Expense: 11",
        "date": "2020-03-18T16:19:10.740Z",
        "category": "Grocery",
        "amount": 2354
    },
    {
        "id": 12,
        "name": "Expense: 12",
        "date": "2020-10-12T19:20:14.861Z",
        "category": "Subscriptions",
        "amount": 8961
    },
    {
        "id": 13,
        "name": "Expense: 13",
        "date": "2021-12-04T19:49:54.745Z",
        "category": "Food",
        "amount": 7970
    },
    {
        "id": 14,
        "name": "Expense: 14",
        "date": "2022-07-18T19:35:05.185Z",
        "category": "Grocery",
        "amount": 8976
    },
    {
        "id": 15,
        "name": "Expense: 15",
        "date": "2023-12-01T12:48:58.728Z",
        "category": "Grocery",
        "amount": 4213
    },
    {
        "id": 16,
        "name": "Expense: 16",
        "date": "2023-12-05T01:28:38.403Z",
        "category": "Food",
        "amount": 6846
    },
    {
        "id": 17,
        "name": "Expense: 17",
        "date": "2021-02-25T22:18:17.341Z",
        "category": "Gas",
        "amount": 8242
    },
    {
        "id": 18,
        "name": "Expense: 18",
        "date": "2022-05-27T18:47:43.140Z",
        "category": "Gas",
        "amount": 3515
    },
    {
        "id": 19,
        "name": "Expense: 19",
        "date": "2022-05-01T05:52:22.037Z",
        "category": "Personal",
        "amount": 6732
    },
    {
        "id": 20,
        "name": "Expense: 20",
        "date": "2020-10-27T23:33:43.003Z",
        "category": "Grocery",
        "amount": 5484
    },
    {
        "id": 21,
        "name": "Expense: 21",
        "date": "2024-04-09T02:20:06.614Z",
        "category": "Personal",
        "amount": 8759
    },
    {
        "id": 22,
        "name": "Expense: 22",
        "date": "2022-02-18T22:16:33.419Z",
        "category": "Gas",
        "amount": 150
    },
    {
        "id": 23,
        "name": "Expense: 23",
        "date": "2021-06-19T02:17:52.617Z",
        "category": "Food",
        "amount": 3379
    },
    {
        "id": 24,
        "name": "Expense: 24",
        "date": "2022-11-22T04:28:50.417Z",
        "category": "Gas",
        "amount": 1208
    },
    {
        "id": 25,
        "name": "Expense: 25",
        "date": "2020-03-18T07:08:00.518Z",
        "category": "Subscriptions",
        "amount": 8223
    },
    {
        "id": 26,
        "name": "Expense: 26",
        "date": "2020-06-23T21:19:39.036Z",
        "category": "Subscriptions",
        "amount": 4973
    },
    {
        "id": 27,
        "name": "Expense: 27",
        "date": "2022-04-24T15:31:54.536Z",
        "category": "Food",
        "amount": 115
    },
    {
        "id": 28,
        "name": "Expense: 28",
        "date": "2020-07-02T15:38:12.290Z",
        "category": "Food",
        "amount": 5177
    },
    {
        "id": 29,
        "name": "Expense: 29",
        "date": "2022-10-02T16:27:36.636Z",
        "category": "Subscriptions",
        "amount": 596
    },
    {
        "id": 30,
        "name": "Expense: 30",
        "date": "2021-04-10T16:42:24.956Z",
        "category": "Gas",
        "amount": 4917
    },
    {
        "id": 31,
        "name": "Expense: 31",
        "date": "2021-01-05T01:40:39.344Z",
        "category": "Grocery",
        "amount": 5118
    },
    {
        "id": 32,
        "name": "Expense: 32",
        "date": "2021-09-07T16:39:43.357Z",
        "category": "Gas",
        "amount": 3133
    },
    {
        "id": 33,
        "name": "Expense: 33",
        "date": "2020-01-18T15:18:44.815Z",
        "category": "Food",
        "amount": 9850
    },
    {
        "id": 34,
        "name": "Expense: 34",
        "date": "2020-11-20T08:27:12.316Z",
        "category": "Grocery",
        "amount": 3135
    },
    {
        "id": 35,
        "name": "Expense: 35",
        "date": "2022-07-18T19:35:05.185Z",
        "category": "Subscriptions",
        "amount": 6946
    },
    {
        "id": 36,
        "name": "Expense: 36",
        "date": "2021-03-22T01:33:14.225Z",
        "category": "Subscriptions",
        "amount": 8733
    },
    {
        "id": 37,
        "name": "Expense: 37",
        "date": "2023-07-05T16:40:58.636Z",
        "category": "Personal",
        "amount": 7789
    },
    {
        "id": 38,
        "name": "Expense: 38",
        "date": "2021-07-07T16:53:18.856Z",
        "category": "Subscriptions",
        "amount": 2536
    },
    {
        "id": 39,
        "name": "Expense: 39",
        "date": "2021-06-28T04:04:57.897Z",
        "category": "Food",
        "amount": 3505
    },
    {
        "id": 40,
        "name": "Expense: 40",
        "date": "2023-11-09T11:49:47.000Z",
        "category": "Subscriptions",
        "amount": 4477
    },
    {
        "id": 41,
        "name": "Expense: 41",
        "date": "2020-12-16T11:19:44.772Z",
        "category": "Grocery",
        "amount": 6968
    },
    {
        "id": 42,
        "name": "Expense: 42",
        "date": "2023-02-01T11:19:11.041Z",
        "category": "Food",
        "amount": 1573
    },
    {
        "id": 43,
        "name": "Expense: 43",
        "date": "2020-03-18T16:19:10.740Z",
        "category": "Personal",
        "amount": 9503
    },
    {
        "id": 44,
        "name": "Expense: 44",
        "date": "2024-06-07T03:01:46.304Z",
        "category": "Food",
        "amount": 8020
    },
    {
        "id": 45,
        "name": "Expense: 45",
        "date": "2020-12-01T08:40:04.011Z",
        "category": "Grocery",
        "amount": 4965
    },
    {
        "id": 46,
        "name": "Expense: 46",
        "date": "2023-08-04T02:45:37.125Z",
        "category": "Gas",
        "amount": 1586
    },
    {
        "id": 47,
        "name": "Expense: 47",
        "date": "2020-06-23T21:19:39.036Z",
        "category": "Gas",
        "amount": 3183
    },
    {
        "id": 48,
        "name": "Expense: 48",
        "date": "2021-06-19T02:17:52.617Z",
        "category": "Personal",
        "amount": 9093
    },
    {
        "id": 49,
        "name": "Expense: 49",
        "date": "2023-09-18T14:59:43.680Z",
        "category": "Personal",
        "amount": 8793
    },
    {
        "id": 50,
        "name": "Expense: 50",
        "date": "2023-03-20T03:10:02.630Z",
        "category": "Grocery",
        "amount": 7645
    }
]

export default expenseList;
