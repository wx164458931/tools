/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * 这是一个常规的面试题，实现是一个方法，这个方法接受一个任务数组，并返回一个对象。
 * 对象中有两个方法，一个start，一个pause。
 * start方法用于开始执行任务，pause方法用于暂停任务。
 * 任务具有原子性，调用paused之后也只是当前任务执行完成之后才会暂停。
 * start返回一个Promsie，Promise的结果是所有任务的结果的数组。
 */
import { GetPromiseType } from './tsTools/common'

enum TaskStatus {
  pending = 'pending',
  running = 'running',
  paused = 'paused',
  reject = 'reject',
  finished = 'finished'
}

type F = (...args: any) => any

type TaskRes<T extends ((...args: any) => any)[]> = {
  [P in keyof T] : GetPromiseType<ReturnType<T[P]>>
}

// type C = [GetPromiseType<ReturnType<()=>Promise<number>>>, GetPromiseType<ReturnType<()=>Promise<string>>>]
type TaskStart<T extends F[]> = () => Promise<TaskRes<T>>
/**
 * 方法实现如下
 * 实现并不是很复杂，但是期望用TS进行类型标注，使得start的返回值类型能够根据传入的任务数组进行推导。
 * 但是实际并不是很满意
 * 后续看看能不能优化
 * @param tasks 
 * @returns 
 */
function processTask<T extends F[]>(tasks: T): {
  start: TaskStart<T>;
  pause: () => void;
} {
  let status = TaskStatus.pending;
  let _resolve: null | ((args: TaskRes<T>) => void) = null;
  let _reject: null | ((...args: any[]) => void) = null;
  const res:TaskRes<T> = [] as TaskRes<T>;
  let runTaskIndex = 0;
  const p: Promise<TaskRes<T>> = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
  });

  const _runTask = async <T extends (...args:any) => any>(task: T): Promise<GetPromiseType<ReturnType<T> | undefined>> => {
    if(status !== TaskStatus.running ) {
      return;
    }

    if(task) {
      try {
        const taskRes: GetPromiseType<ReturnType<T>> = await task();
        res[runTaskIndex] = taskRes;
      }
      catch(err) {
        console.log('任务执行失败',err);
        res[runTaskIndex] = err;
        status = TaskStatus.reject;
        if(_reject) {
          _reject(err);
        }
      }
    }
    else {
      res[runTaskIndex] = null;
    }
  }

  const run = async () => {
    if(runTaskIndex === tasks.length || status === TaskStatus.finished) {
      return;
    }

    status = TaskStatus.running;
    const task = tasks[runTaskIndex];

    if(task) {
      await _runTask(task)
    }
    runTaskIndex++;

    if(runTaskIndex === tasks.length) {
      status = TaskStatus.finished;
      if(_resolve) {
        _resolve(res);
      }
    }

    if(status === TaskStatus.running) {
      run();
    }
  }

  return {
    start() {
      if(status === TaskStatus.running) {
        return p;
      }
      run();
      return p;
    },
    pause() {
      console.log('暂停执行任务');
      status = TaskStatus.paused;
    }
  }
}

(function() {
  // 测试
  const task1 = () => new Promise<number>((resolve) => {
    console.log('开始执行任务1');
    setTimeout(() => {
      console.log('任务1执行完成');
      resolve(1);
    }, 1000);
  })

  const task2 = () => new Promise<string>((resolve) => {
    console.log('开始执行任务2');
    setTimeout(() => {
      console.log('任务2执行完成');
      resolve('2');
    }, 1000);
  })

  const task3 = () => new Promise<number>((resolve) => {
    console.log('开始执行任务3');
    setTimeout(() => {
      console.log('任务3执行完成');
      resolve(3);
    }, 1000);
  })

  const task4 = () => new Promise<boolean>((resolve) => {
    console.log('开始执行任务4');
    setTimeout(() => {
      console.log('任务4执行完成');
      resolve(true);
    }, 1000);
  })

  const tasks = processTask([task1, task2, task3, task4]);

  console.log('启动任务');
  tasks.start().then((result) => {
    console.log('全部任务执行完成！！！',result);
  }).catch((err: any) => {
    console.log('任务执行失败了！！！', err);
  })
  setTimeout(() => {
    tasks.pause();
  }, 1500)
  setTimeout(() => {
    console.log('恢复执行任务');
    tasks.start();
  }, 6000)

  // type PA = typeof Promise.all([task1, task2, task3, task4]);
  // type PAThen = PA['then']
  // type Res = Promise<TaskRes<[typeof task1, typeof task2, typeof task3, typeof task4]>>
  // type ResThen = Res['then']
})()

export default processTask