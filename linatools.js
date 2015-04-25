
// vector

function norm(x) {
  return Math.sqrt(x[0]*x[0] + x[1]*x[1]);
}

function subtract(d) {
  return [ [d[0][0] - d[1][0]]
         , [d[0][1] - d[1][1]]
         ];
}


// 2x2 matrix saved as [a,b,c,d]

function determinant(m) {
  return m[0]*m[3] - m[1]*m[2];
}

function inverse(m) {
  var d = 1/determinant(m);
  return [  m[3]*d,-m[1]*d
         , -m[2]*d, m[0]*d
         ];
}

// only 2x2 \times 2x1
function mmult(m1, m2) {
  return [ m1[0]*m2[0] + m1[1]*m2[1]
         , m1[2]*m2[0] + m1[3]*m2[1]
         ];
}
