function seedTasks() {
    const tasks = {};

    tasks[1] = { TaskID: 1, TaskDifficulty: "easy", TaskDescription: "print the string of text 'hello world'" };
    tasks[2] = { TaskID: 2, TaskDifficulty: "easy", TaskDescription: "print the number '123456789'" };
    tasks[3] = { TaskID: 3, TaskDifficulty: "easy", TaskDescription: "print the sum of 111 and 222" };
    tasks[4] = { TaskID: 4, TaskDifficulty: "easy", TaskDescription: "print the difference between 1000 and 123" };
    tasks[5] = { TaskID: 5, TaskDifficulty: "easy", TaskDescription: "print the product of 6 and 7" };
    tasks[21] = { TaskID: 21, TaskDifficulty: "medium", TaskDescription: "using a loop print the text 'ho ' 3 times" };
    tasks[22] = { TaskID: 22, TaskDifficulty: "medium", TaskDescription: "using a loop print the text 'HA ' 5 times" };
    tasks[23] = { TaskID: 23, TaskDifficulty: "medium", TaskDescription: "using a loop print a right angle triangle made of asterisks (*) in three rows with each subsequent row containing one more * than the previous" };
    tasks[24] = { TaskID: 24, TaskDifficulty: "medium", TaskDescription: "using a loop print a square shape made of 5 dollar signs ($) in each dimension" };
    tasks[25] = { TaskID: 25, TaskDifficulty: "medium", TaskDescription: "using a loop print a rectangle shape made of 8 equal signs (=) in each column of 4 rows" };
    tasks[100] = { TaskID: 100, TaskDifficulty: "hard", TaskDescription: "given the string '!yenruoj gnidoc ruoy fo trap sa tfarCedoC gnisu rof uoy knahT\n.noitseuq lanif eht detelpmoc evah uoY !snoitalutargnoC' please print its reverse" };

    return tasks;
}
