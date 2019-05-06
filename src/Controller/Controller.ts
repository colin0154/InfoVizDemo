interface IEventEmitter {
    EmitEvent(): Event;
}

export abstract class Controller implements IEventEmitter {
    public abstract EmitEvent(): Event;

}