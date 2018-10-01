const request = require('supertest');
const should = require('should');
const express = require('express');
const cookieParser = require('cookie-parser');

const server = require('../server');

describe('POST /deluser',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/deluser')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /register',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/register')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /rmadd',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/rmadd')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /rmrmv',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/rmrmv')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /getgroup',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/getgroup')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /superpromote',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/superpromote')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /superdemote',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/superdemote')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /grouppromote',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/grouppromote')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /groupdemote',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/groupdemote')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /creategroup',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/creategroup')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /deletegroup',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/deletegroup')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /createroom',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/createroom')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /deleteroom',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/deleteroom')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /room',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/room')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /msg',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/msg')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /data',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/data')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /login',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/login')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /groupadd',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/groupadd')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});

describe('POST /grouprmv',function()
{
	it('respond with json',function(done)
	{
		request(server.app)
		.get('/grouprmv')
		.set('Accept','application/json')
		.expect('Content-Type',/json/)
	});
});