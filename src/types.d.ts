/// <reference types="vite/client" />
import { calendar_v3 } from 'googleapis';

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

type GoogleEvent = calendar_v3.Schema$Event;
