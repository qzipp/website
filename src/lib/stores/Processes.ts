import { type ProcessInfo } from "$lib/types/ProcessInfo";
import { writable, type Writable } from "svelte/store";

export type ProcessStore = Writable<ProcessInfo>;

const Processes = writable<ProcessStore[]>([])

export default Processes;