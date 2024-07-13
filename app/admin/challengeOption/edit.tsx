import { BooleanInput, Edit, ReferenceInput, SimpleForm, TextInput, required } from "react-admin"


export const ChallengeOptionEdit = () => {
    return (
        <Edit>
            <SimpleForm  >
                <TextInput  source="text" validate={[required()]} label="Text" />
                <BooleanInput source="correct" label="Correct option" />
                <ReferenceInput source="activeChallenge" reference="challenges" />
                <TextInput source="imageSrc" validate={[required()]} label="Image URl" />
                <TextInput source="audioSrc" validate={[required()]} label="Audio URl" />
            </SimpleForm>
        </Edit>
    )
}