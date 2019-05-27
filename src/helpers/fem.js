/**
 * Adapts each part to standart square to vertexes of standart cube:
 *
 * 3----6----2
 * |         |
 * |         |
 * 7         5
 * |         |
 * |         |
 * 0----4----1
 */
export const parts = [
    [0, 1, 5, 4, 8, 13, 16, 12],
    [1, 2, 6, 5, 9, 14, 17, 13],
    [2, 3, 7, 6, 10, 15, 18, 14],
    [3, 0, 4, 7, 11, 12, 19, 15],
    [0, 1, 2, 3, 8, 9, 10, 11],
    [4, 5, 6, 7, 16, 17, 18, 19]
];

// Defines collection of triangles on each square
export const trianlgesOnSquare = [
    [7, 6, 3],
    [7, 0 ,4],
    [4, 1, 5],
    [5, 2, 6],
    [7, 4, 6],
    [4, 5, 6]
];

export const bigTrianlgesOnSquare = [
    [0, 3, 2],
    [0, 2, 1]
];

export const getID = (fe, part) => `fe_${fe}:${part}`;