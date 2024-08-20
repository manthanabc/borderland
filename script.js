

import OBJFile from './objparser.js'

let parent = document.getElementById('main');
let tris = [];
let counter =0;

class vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  normalize() {
    this.magnitude = Math.sqrt(this.x*this.x + this.y*this.y)
    this.x /= this.magnitude;
    this.y /= this.magnitude;
  }
}

class triangle {
  constructor(t1, t2, t3) {
    this.t1= t1;
    this.t2= t2;
    this.t3= t3;
  }
}

let rotate = (p) => {
    let angle_rad = angle * Math.PI / 180.0; 
    let a = [0, 0, 0 ]
    let s = Math.sin(angle_rad);
    let c =Math.cos(angle_rad);
    a[0] = p[0] * c - p[2] * s;
    a[1] = p[1] ;
    a[2] = p[0] * s + p[2] * c;
    return a;
}

let convert2d = ([ox, oy, oz]) => {
  
  // Rotate about center of loaded model
  let [x, y, z] = rotate([ox, oy, oz])

  // Subtract camera cordinates
  z += 20;
  y += 10;

  let aspect = 1;
  let fovRad = 95 * Math.PI /180;

  let far = 1000;
  let near = 10;
  
  let matrix = [  
    [1 / (aspect * Math.tan(fovRad / 2)), 0, 0, 0],
    [0, 1 / Math.tan(fovRad / 2), 0, 0],
    [0, 0, -1, -1],
    [0, 0, -1, 0]  
  ]

  let c=1;
  let result = [0, 0, 0, 0]
  for (let i = 0; i < 4; i++) {
    result[i] = matrix[i][0] * x +
                matrix[i][1] * y +
                matrix[i][2] * z +
                matrix[i][3] * c;
  } 

  x= result[0]/result[3];
  y= result[1]/result[3];

  // Convert to screen space cordinates
  x *= 400;
  y *= -400;
  
  x += 450;
  y += 450;
  return [x, y]
}


class rendertrig {
  constructor(p1, p2, p3) {
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.id = counter++;
  }
  init() {
    let elm = document.createElement('div');
    elm.style=`top: ${Math.random()*600}; left: ${Math.random()*600}; border-color:#${Math.random()*100}`;
    parent.appendChild(elm);
    this.elm = elm
    this.color = '#30'+(Math.random() * 0xFFFF << 0).toString(16).padStart(4, '0') + '80';
    let p1 =convert2d(this.p1);
    let p2 =convert2d(this.p2);
    let p3 =convert2d(this.p3);
    
    this.v1 = new vector(p1[0]-p2[0], p1[1]-p2[1]);
    this.v2 = new vector(p3[0]-p2[0], p3[1]-p2[1]);
    this.v3 = new vector(p1[0]-p3[0], p1[1]-p3[1]);
  }
  draw() {
    let p1 =convert2d(this.p1);
    let p2 =convert2d(this.p2);
    let p3 =convert2d(this.p3);

    this.v1.x = p1[0]-p2[0];
    this.v1.y = p1[1]-p2[1];

    this.v2.x = p3[0]-p2[0];
    this.v2.y = p3[1]-p2[1];

    this.v3.x = p1[0]-p3[0];
    this.v3.y = p1[1]-p3[1];

    let v1 = this.v1;
    let v2 = this.v2;
    let v3 = this.v3;

    v1.normalize(); v2.normalize(); v3.normalize();

    let angle = Math.acos((v1.x*v2.x)+(v1.y*v2.y));
    let angle2 = Math.acos((v1.x*v3.x)+(v1.y*v3.y));
  
    angle = angle * (180/Math.PI);
    angle2 = angle2 * (180/Math.PI);
    let angle3 = 180 - angle - angle2;

    let t1 = new vertex(p1[0], p1[1], p1[2], angle2);
    let t2 = new vertex(p2[0], p2[1], p1[2], angle);
    let t3 = new vertex(p3[0], p3[1], p1[2], angle3);

    let tg;

    if(t1.angle >= t2.angle && t1.angle >= t3.angle) {
        tg = new triangle(t1, t3, t2);
    }
    else if(t2.angle >= t1.angle && t2.angle >= t3.angle) {
        tg = new triangle(t2, t3, t1); 
    }
    else if(t3.angle >= t1.angle && t3.angle >= t2.angle) {
         tg = new triangle(t3, t1, t2); 
    }
  
    let y=this.elm // document.getElementsByClassName('trig')[0]
    let distbase = dist(tg.t2.x, tg.t2.y, tg.t3.x, tg.t3.y); 

    let sign = (tg.t2.x - tg.t1.x) * (tg.t3.y - tg.t1.y) - (tg.t3.x - tg.t1.x) * (tg.t2.y - tg.t1.y);
    if(sign<0) { sign = -1 } else { sign=1 }
  
    let distup, npx, npy
    if(sign < 0) {
      distup =   dist(tg.t2.x, tg.t2.y, tg.t1.x, tg.t1.y); 
      npx = -Math.cos(tg.t2.angle *Math.PI/ 180) * distup + tg.t1.x
      npy = Math.sin(tg.t2.angle*Math.PI/ 180) * distup + tg.t1.y
    } else {
      distup =   dist(tg.t3.x, tg.t3.y, tg.t1.x, tg.t1.y); 
      npx = -Math.cos(tg.t3.angle *Math.PI/ 180) * distup + tg.t1.x
      npy = Math.sin(tg.t3.angle*Math.PI/ 180) * distup + tg.t1.y
    }
    // the rest will work fine
    //npx is the down left most arrow of the triangle

    let borderBottom = npy-tg.t1.y
    let borderLeft = tg.t1.x -npx
    let borderRight = -tg.t1.x + npx + distbase
    // elm
    y.style.top = tg.t1.y;
    y.style.left = tg.t1.x;
    y.style['border-bottom'] = `${borderBottom}px solid ${this.color}`
    y.style['border-left'] = `${borderLeft}px solid transparent`
    y.style['border-right'] = `${borderRight}px solid transparent`
    y.style['border-top'] = `0px solid transparent`


    let baseangle = 90 - Math.atan( (tg.t2.x - tg.t3.x)/(tg.t2.y - tg.t3.y) ) * 180/Math.PI;
    if(tg.t2.y<tg.t3.y) baseangle+=180
    baseangle = 360-baseangle

    baseangle += (sign < 0)? 180 : 0; 

    let rotx = tg.t1.x - borderLeft + (borderLeft + borderRight)/2;
    let roty = tg.t1.y + borderBottom/2;

    baseangle *=-1
    y.className = 'trig'
    y.style['transform'] = `translateX(-${borderLeft}px) translate(${tg.t1.x-rotx}px, -${ borderBottom/2 }px) rotate(${baseangle}deg) translate(${-tg.t1.x+rotx}px, ${ borderBottom/2 }px)`;
  }
}

class vertex {
  constructor(x, y, z, angle) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.angle  = angle;
  }
}




// Draw a div at given cordinates for debugging
let draw = (x, y, color) => {
  let elm = document.createElement('div');
  elm.className='trig';
  elm.style=`top: ${y}; left: ${x}; border: solid ${color};`;
  parent.appendChild(elm)
}

let dist = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2));
}

let angle = 60;


let faces = []

let t = await fetch('./teapot.obj')
let tex = await t.text();

const fileContents =
  'v 0 0 0 \n' +
  'v 0 1 0 \n' +
  'v 1 0 0 \n' +
  'f 1 2 3';
  
const objFile = new OBJFile(tex);
const output = objFile.parse(); // see description below


let model = output.models[0];
let Obj_faces = model.faces;
let vertices = model.vertices;

console.log(vertices.length)
console.log(Obj_faces.length)

let scale = 4;

Obj_faces.forEach((face) => {
  let tex = vertices[face.vertices[0].vertexIndex -1]
  let t1 = [tex.x *scale , -tex.y *scale , tex.z *scale ];
  tex = vertices[face.vertices[1].vertexIndex -1]
  let t2 = [tex.x *scale , -tex.y *scale , tex.z *scale ];
  tex = vertices[face.vertices[2].vertexIndex -1]
  let t3 = [tex.x *scale , -tex.y *scale , tex.z *scale ];

  faces.push(new rendertrig(
    t1, t2, t3
  ))
})

faces.forEach((trig) => {
  trig.init();
})
let renderCube = () => {
  faces.forEach((trig) => {
    trig.draw();
  })
}

renderCube()

window.setInterval(() => {
   angle += 1;
   renderCube();
}, 150)

// document.onmousemove = handleMouseMove;
function handleMouseMove(event) {
    if(Math.random() > 0.1) {
      // angle += 1
      // renderCube();
    }
}

