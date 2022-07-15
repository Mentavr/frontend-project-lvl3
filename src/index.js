#!/usr/src/env node
import './stylish.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import i18next from 'i18next';
import app from '../bin/rss.js';
import instance from '../bin/instance.js';

const i18nextInstance = i18next.createInstance();
i18nextInstance.init(instance);

app(i18nextInstance);
