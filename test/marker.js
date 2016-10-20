'use strict';

const marker = require('./../src/marker');

const write = process.stdout.write;
const log = console.log;

describe('[Marker]', () => {

    it('Is the function', done => {
        if(typeof marker === 'function') {
            done();
        } else {
            done(new Error('It is not a function'));
        }
    });

    it('Using process.stdout.write', done => {
        let out = '';

        process.stdout.write = string => out = string;
        marker();
        process.stdout.write = write;

        if(/^\[daemon-command-webpack-plugin]\[resolve-marker]$/gm.test(out)) {
            done();
        } else {
            done(new Error('The marker is not in the process.stdout'))
        }
    });

    it('Using console.log', done => {
        let out = '';

        console.log = string => out = string;
        process.stdout.write = null;
        marker();
        console.log = log;
        process.stdout.write = write;

        if(/^\[daemon-command-webpack-plugin]\[resolve-marker]$/gm.test(out)) {
            done();
        } else {
            done(new Error('The marker is not in the console.log'))
        }
    });

    it('Undefined process.stdout.write & console.log throw error', done => {
        console.log = null;
        process.stdout.write = null;
        try {
            marker();
            console.log = log;
            process.stdout.write = write;
            done(new Error('No exception'))
        } catch(e) {
            console.log = log;
            process.stdout.write = write;
            done();
        }
    });

    it('String message process.stdout.write', done => {
        let out = '';

        process.stdout.write = null;
        process.stdout.write = string => out = string;
        marker('string message');
        process.stdout.write = write;

        if(/^\[daemon-command-webpack-plugin]\[resolve-marker]: string message$/gm.test(out)) {
            done();
        } else {
            done(new Error('The marker argument message is not in the process.stdout'))
        }
    });

    it('String message console.log', done => {
        let out = '';

        process.stdout.write = null;
        console.log = string => out = string;
        marker('string message');
        console.log = log;
        process.stdout.write = write;

        if(/^\[daemon-command-webpack-plugin]\[resolve-marker]: string message$/gm.test(out)) {
            done();
        } else {
            done(new Error('The marker argument message is not in the console.log'))
        }
    });

    it('Array message process.stdout.write', done => {
        let out = '';

        process.stdout.write = null;
        process.stdout.write = string => out = string;
        marker([
            'message 1',
            'message 2',
            'message 3'
        ]);
        process.stdout.write = write;

        if(/^\[daemon-command-webpack-plugin]\[resolve-marker]: message 1,message 2,message 3$/gm.test(out)) {
            done();
        } else {
            done(new Error('The marker argument array message is not in the process.stdout'))
        }
    });

    it('String message console.log', done => {
        let out = '';

        process.stdout.write = null;
        console.log = string => out = string;
        marker([
            'message 1',
            'message 2',
            'message 3'
        ]);
        console.log = log;
        process.stdout.write = write;

        if(/^\[daemon-command-webpack-plugin]\[resolve-marker]: message 1,message 2,message 3$/gm.test(out)) {
            done();
        } else {
            done(new Error('The marker argument array message is not in the console.log'))
        }
    });

});