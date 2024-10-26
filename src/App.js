import { useRef, useState } from 'react';
import { useInterval } from '@react-hooks-library/core';

import { GameEngine } from 'react-game-engine';

import './App.css';
import { Bike } from './Bike';


const step = ((entities, { input }) => {

    const { payload } = input.find(x => x.name === "onMouseMove" || x.name === "onTouchMove") || {};
    let angle_change = 0;
    if (payload && (payload.buttons > 0 || payload.type == "touchmove")) {
        entities["bike"].initial = false

        const center_x = 0.33;
        const center_y = 0.33;
        let touch_x = 0;
        let touch_y = 0;
        if (payload.type == "touchmove") {
            const offsets = payload.targetTouches[0].target.getBoundingClientRect();
            touch_x = payload.targetTouches[0].clientX / window.innerWidth - center_x;
            // innerWidth for y is not a typo (since we work in vw)
            touch_y = (payload.targetTouches[0].clientY  - offsets.top) / window.innerWidth - center_y;
        } else {
            const offsets = payload.target.getBoundingClientRect();
            touch_x = payload.clientX / window.innerWidth - center_x;
            touch_y = (payload.clientY - offsets.top) / window.innerWidth - center_y;
            
        }

        const angle = Math.atan2(touch_y, touch_x) * 180 / Math.PI * -1 + 180;

        let velocity = 0
        // weird edge cause because spinning back past 0 breaks it
        if (angle > entities["bike"].crank_angle && !(angle > 270 && entities["bike"].crank_angle < 90)) {
            angle_change = angle - entities["bike"].crank_angle;
            velocity = angle_change * 2.0; // gearing - I think 34x25 or so?
        }

        if (velocity > entities["bike"].velocity) {
            entities["bike"].velocity = velocity
        }

        entities["bike"].crank_angle = angle;
    }
    if (entities["bike"].velocity > 0) {
        entities["bike"].velocity -= entities["bike"].velocity * 0.01
        if (entities["bike"].velocity < 0.05) {
            entities["bike"].velocity = 0
            entities["global"].countdown = 50
        }
    }
    if (entities["bike"].velocity == 0) {
        if (entities["global"].countdown > 0) {
            entities["global"].countdown -= 1
        } else if (entities["global"].countdown == 0){
            entities["bike"].hook(entities["bike"].wheel_angle * -1)
            entities["global"].countdown = -1
        }
    }

    entities["bike"].wheel_angle = (entities["bike"].wheel_angle - entities["bike"].velocity) % 360

    return entities;
})

function Description({ angle }) {

    const climbs = [{angle: 0,
        name: "大阪城激坂",
        video: "https://www.youtube.com/embed/SX0bOAWQ5qM?si=8mBa4KSG-TfuzXUe&t=437",
        strava: ""
    }, {angle: 33,
        name: "暗峠",
        video: "https://www.youtube.com/embed/nyDIrWVMJT4?si=1y8rr43agtd852nD",
        strava: "https://www.strava.com/segments/11289707"
    },
        {angle: 84,
        name: "十三峠",
        video: "https://www.youtube.com/embed/IMpF9cuUQkQ?pp=iAQB",
            strava: "https://www.strava.com/segments/1939623"
        },
        {angle: 160,
            name: "傍示峠",
            video: "https://www.youtube.com/embed/QJt66EJJo4U",
            strava: "https://www.strava.com/segments/3017767"
        },
        {angle: 204,
            name: "妙見山",
            video: "https://www.youtube.com/embed/7cgGyxqWVds?si=auZi_MW64ElKu0bO&t=450",
            strava: "https://www.strava.com/segments/14066323"
        },
        {
            angle: 250,
            name: "六甲山",
            video: "https://www.youtube.com/embed/spDke4JgftY?pp=iAQB",
            strava: "https://www.strava.com/segments/1693520"
        },
        {angle: 305,
            name: "葛城山",
            video: "https://www.youtube.com/embed/AhCRDdkv7WA?si=YAjrR1XmIWzFO8iO",
            strava: "https://www.strava.com/segments/9503734"
        },
    ];
    // The angle is out slightly...
    angle = (angle - 5)% 360;

    let climb = climbs[0]
    for (let i = 0; i < climbs.length; i++) {
        if (angle < climbs[i].angle) {
            break;
        }
        climb = climbs[i]
    }

    if (isNaN(angle)) {
        return <div>
            <p>ペダルを回して見てください。どこに止まっても、楽しい（？）ヒルクライムが待っています。</p>
            </div>
    } else {
        return <div>
            <p><strong>{climb.name}</strong>を当選しました。行ってらっしゃい！</p>
            <p><a href={climb.video} target="_blank">参考動画</a></p>
        <iframe width={560} height={315} src={climb.video} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            <p><a href={climb.strava} target="_blank">Stravaセグメント</a></p>
            </div>
    }
}

function App() {

    let [target, setTarget] = useState(NaN);

  return (
    <div className="App" style={{maxWidth: "1000px"}}>
      <h1>ハズレなし自転車コギコギヒルクライム抽選会</h1>

      <GameEngine style={{width: "80vw", height: "60vw"}}
          systems={[step]}
        entities={{
            bike: {x: 0, y: 0, wheel_angle: 0, crank_angle: 0, velocity: 0, initial: true, renderer: Bike, hook: setTarget},
            global: {countdown: -1}
        }}>
      </GameEngine>
      <Description angle={target} />

    </div>
  );
}


export default App;

/* Aaaaand here we run into a problem... how to capture the mouse movement and stuff? 
 * React game engine allows for that, just follow mouse movement the usual way
 *
 * */

