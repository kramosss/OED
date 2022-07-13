/* This Source Code Form is subject to the terms of the Mozilla Public
  * License, v. 2.0. If a copy of the MPL was not distributed with this
  * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
import * as React from 'react';
import { Modal, Button } from 'react-bootstrap';
import '../../styles/unit-edit-modal.css';
import { UnitData, DisplayableType, UnitRepresentType, UnitType } from '../../types/redux/units';
import { Input } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import translate from '../../utils/translate';
import { useDispatch } from 'react-redux';
import { submitEditedUnits } from '../../actions/units';
import { removeUnsavedChanges } from '../../actions/unsavedWarning';
// I realize that * is already imported from react
import { useState } from 'react';
import { editUnitDetails } from '../../actions/units';
import { _ } from 'core-js';

interface EditUnitModalComponentProps {
	show: boolean;
	unit: UnitData;
	// passed in to handle closing the modal
	handleClose: () => void;
}

// Updated to hooks
export default function EditUnitModalComponent(props: EditUnitModalComponentProps) {

	const dispatch = useDispatch();

	/* State */
	// We can definitely sacrifice readibility here (and in the render) to consolidate these into a single function if need be

	// identifier
	const [identifier, setIdentifier] = useState(props.unit.identifier);
	const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setIdentifier(e.target.value);
	}

	// typeOfUnit
	const [typeOfUnit, setTypeOfUnit] = useState(props.unit.typeOfUnit);
	const handleTypeOfUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTypeOfUnit(e.target.value as UnitType);
	}

	// unitRepresent
	const [unitRepresent, setUnitRepresent] = useState(props.unit.unitRepresent);
	const handleUnitRepresentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setUnitRepresent(e.target.value as UnitRepresentType)
	}

	// displayable
	const [displayable, setDisplayable] = useState(props.unit.displayable);
	const handleDisplayableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDisplayable(e.target.value as DisplayableType);
	}

	// preferredDisplay
	const [preferredDisplay, setPreferredDisplay] = useState(props.unit.preferredDisplay);
	const handlePreferredDisplayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPreferredDisplay(JSON.parse(e.target.value));
	}

	// secInRate
	const [secInRate, setSecInRate] = useState(props.unit.secInRate);
	const handleSecInRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSecInRate(Number(e.target.value));

	}

	// suffix
	const [suffix, setSuffix] = useState(props.unit.suffix);
	const handleSuffixChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSuffix(e.target.value);
	}

	// note
	const [note, setNote] = useState(props.unit.note);
	const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNote(e.target.value);
	}
	/* End State */

	// Reset the state to default values
	// To be used for the discard changes button
	// Different use case from CreateUnitModalComponent's resetState
	// This allows us to reset our state to match the store in the event of an edit failure
	// Failure to edit units will not trigger a re-render, as no state has changed. Therefore, we must manually reset the values
	const resetState = () => {
		setIdentifier(props.unit.identifier);
		setTypeOfUnit(props.unit.typeOfUnit);
		setUnitRepresent(props.unit.unitRepresent);
		setDisplayable(props.unit.displayable);
		setPreferredDisplay(props.unit.preferredDisplay);
		setSecInRate(props.unit.secInRate);
		setSuffix(props.unit.suffix);
		setNote(props.unit.note);
	}

	// Save changes
	// Currently using the old functionality which is to compare inherited prop values to state values
	// If there is a difference between props and state, then a change was made
	// Side note, we could probably just set a boolean when any input i
	const handleSaveChanges = () => {

		// Close the modal first to avoid repeat clicks
		props.handleClose();

		// Check for changes by comparing state to props
		const unitHasChanges =
			(props.unit.identifier != identifier ||
				props.unit.typeOfUnit != typeOfUnit ||
				props.unit.unitRepresent != unitRepresent ||
				props.unit.displayable != displayable ||
				props.unit.preferredDisplay != preferredDisplay ||
				props.unit.secInRate != secInRate ||
				props.unit.suffix != suffix ||
				props.unit.note != note);

		// Only do work if there are changes
		if (unitHasChanges) {
			const editedUnit = {
				...props.unit,
				identifier, unitRepresent, typeOfUnit,
				displayable, preferredDisplay, secInRate,
				suffix, note
			}
			// Save our changes by:
			// Adding our changes as a new unit to the edited unit store state
			// Submitting our changes to the store state
			dispatch(editUnitDetails(editedUnit));
			dispatch(submitEditedUnits());
			dispatch(removeUnsavedChanges());
		}

	}

	return (
		<>
			<Modal show={props.show} onHide={props.handleClose} >
				<Modal.Header closeButton>
					<Modal.Title> <FormattedMessage id="edit.unit" /></Modal.Title>
				</Modal.Header>

				{/* when any of the unit are changed call one of the functions.  */}
				<Modal.Body className="show-grid">
					<div id="container">
						<div id="modalChild">
							<div>
								<FormattedMessage id="unit.identifier" /> <span><br />
									<input
										name="identifier" type="text"
										defaultValue={identifier}
										placeholder="Identifier"
										onChange={e => handleIdentifierChange(e)}
									/></span>
							</div>
							<div>
								<label><FormattedMessage id="unit.type.of.unit" /> </label>
								<Input name="typeOfUnit" type='select' defaultValue={typeOfUnit} onChange={e => handleTypeOfUnitChange(e)} >
									{Object.keys(UnitType).map(key => {
										return (<option value={key} key={key}>{translate(`UnitType.${key}`)}</option>)
									})}
								</Input>
							</div>
							<div>
								<label><FormattedMessage id="unit.represent" /> </label>
								<Input name="unitRepresent" type='select' defaultValue={unitRepresent} onChange={e => handleUnitRepresentChange(e)}>
									{Object.keys(UnitRepresentType).map(key => {
										return (<option value={key} key={key}>{translate(`UnitRepresentType.${key}`)}</option>)
									})}
								</Input>
							</div>
							<div>
								<label><FormattedMessage id="unit.displayable" /> </label>
								<Input name="displayable" type='select' defaultValue={displayable} onChange={e => handleDisplayableChange(e)}>
									{Object.keys(DisplayableType).map(key => {
										return (<option value={key} key={key}>{translate(`DisplayableType.${key}`)}</option>)
									})}
								</Input>
							</div>
							<div>
								<label><FormattedMessage id="unit.preferred.display" /> </label>
								<Input name="preferredDisplay" type='select' defaultValue={preferredDisplay.toString()} onChange={e => handlePreferredDisplayChange(e)}>
									<option value="true"> {translate('yes')} </option>
									<option value="false"> {translate('no')} </option>
								</Input>
							</div>
							<div>
								<FormattedMessage id="unit.sec.in.rate" /> <span><br />
									<input
										name="secInRate"
										type="number"
										defaultValue={secInRate}
										onChange={e => handleSecInRateChange(e)}
										placeholder="Sec In Rate"
									/></span>
							</div>
							<div>
								<label><FormattedMessage id="unit.suffix" /> </label>
								<input
									type="text"
									defaultValue={suffix}
									placeholder="Suffix"
									onChange={e => handleSuffixChange(e)}
								/>
							</div>
							<div>
								<label><FormattedMessage id="unit.note" /> </label>
								<input
									type="text"
									defaultValue={note}
									placeholder="Note"
									onChange={e => handleNoteChange(e)}
								/>
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					{/* Hides the modal */}
					<Button variant="secondary" onClick={props.handleClose}>
						<FormattedMessage id="close" />
					</Button>
					{/* On click calls the function onSaveChanges in this componenet */}
					<Button variant="primary" onClick={handleSaveChanges}>
						<FormattedMessage id="save.all" />
					</Button>
				</Modal.Footer>
			</Modal>
		</>
	);
}