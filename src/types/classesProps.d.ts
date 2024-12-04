export type DialogButton = 'ok' | 'yes' | 'no' | 'cancel';

export type DialogSuccessResult = {
	pressedButton: DialogButton
};

export type DialogResolveResult = DialogSuccessResult | null;

export type EventActionType = 'async' | 'sync';

export type EventActionSuccessResult = {
	eventActionType: EventActionType
};

export type EventActionResolveResult = EventActionSuccessResult | null;
