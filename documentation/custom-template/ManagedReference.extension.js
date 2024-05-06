// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

/*************************************************************************************************
   General functions and constants.
 */
const DEFAULT_DEPRECATION_MESSAGE = "No reason specified."
const hasObsoleteAttribute = x => x.type === 'System.ObsoleteAttribute';
const isTypeString = x => x.type === "System.String";
const isProperties = x => x.id === 'properties';
const isPropertyType = x => x.type === "property";
const isEnumValueType = x => x.type ==="EnumValue";

let doLog = false;

/*************************************************************************************************
    Event Handlers
 ************************************************************************************************/

// This method will be called at the start of exports.transform in ManagedReference.html.primary.js
exports.preTransform = function (model) {
  return model;
}

// TODO: Left - Fix some reuse.

// This method will be called at the end of exports.transform in ManagedReference.html.primary.js
exports.postTransform = function (model) {
  if(!model.isClass) return model;

  doLog = true;

  const customDataModel = createCustomDataModelForClass(model);
  const jsonView = mapJsonView(customDataModel);
  const tableView = mapTableView(customDataModel);

  model.customData = {
    general: {
      eventName: customDataModel.eventName,
      isDeprecatedEvent:customDataModel.isDeprecatedEvent,
      isDeprecatedEventMessage: customDataModel.isDeprecatedEventMessage
    },
    jsonView: jsonView,
    tableView: tableView
  }

  model.customDataModel = customDataModel;

  return model;
}

/**
 * Create Custom Data Model
 */

function createCustomDataModelForClass(model){
  const directMembers = getDirectMembers(model, model._classes);
  const inheritedMembers = getInheritedMembers(model, model._classes);

  return {
    uid: model.uid,
    eventName: model.uid.split(".").pop(),
    isDeprecatedEvent: getIsDeprecated(model),
    isDeprecatedEventMessage: getIsDeprecatedMessage(model),
    members: [ ...directMembers, ...inheritedMembers ]
  }
}

function getIsDeprecated(model){
  if(!model.attributes) return false;
  if (!model.attributes.length) return false;
  var item = model.attributes.find(hasObsoleteAttribute);
  return !!item;
}

function getIsDeprecatedMessage(model){
  if(!getIsDeprecated(model)) return null;
  return model
    .attributes.find(hasObsoleteAttribute)
    .arguments.find(isTypeString).value || DEFAULT_DEPRECATION_MESSAGE;
}

function getDirectMembers(model, allClasses){
  if (model.children.length === 0) return []
  var propertiesChild = model.children.filter(isProperties)
  if(propertiesChild.length != 1)  return []

  return propertiesChild[0]
    .children
    .map(member => mapDirectMember(member, model, allClasses));
}

function mapDirectMember(member, model, allClasses){
  const targetClass = allClasses.find(x => x.uid === member.uid);
  const name = member.name[0].value;
  const type = member.syntax.propertyValue.type.uid;

  const typeChildren = mapMemberTypeChildren(member.uid, type, targetClass, allClasses);
  
  return {
    name: name,
    type: type,
    typeChildren: typeChildren,
    uid: member.uid,
    summary: targetClass.summary,
    parentUid: model.uid,
    isDeprecated: getIsDeprecated(member),
    isDeprecatedMessage: getIsDeprecatedMessage(member)
  }
}

function mapMemberTypeChildren(parentUid, type, targetClass, allClasses){
  if(type.startsWith("System.")) return [];

  const targetChildType = targetClass.syntax.return.type;
  const targetChildClass = allClasses.find(x => x.uid === targetChildType);

  if(!targetChildClass.children) {
    return [];
  };

  return targetChildClass
    .children
    .map(x => allClasses.find(y => y.uid === x))
    .map(x => {
      const typeChildren = targetChildClass.type === "Enum" ? [] : mapMemberTypeChildren(x.uid, x.syntax.return.type, x, allClasses);
      const type = targetChildClass.type === "Enum" ? "EnumValue" : x.syntax.return.type;

      return {
        name: x.name,
        type: type,
        typeChildren: typeChildren,
        uid: x.uid,
        summary: x.summary,
        parentUid: parentUid,
        isDeprecated: getIsDeprecated(x),
        isDeprecatedMessage: getIsDeprecatedMessage(x)
      }
    });
}

function getInheritedMembers(model, allClasses){
  return model.inheritedMembers
    .filter(isPropertyType)
    .map(member => mapInheritedMembers(member, model, allClasses));
}

function mapInheritedMembers(member, model, allClasses){
  const parentUid = member.uid.split(".").slice(0, -1).join(".")
  const targetClass = allClasses.find(y => y.uid === member.uid);
  const type = targetClass.syntax.return.type;

  const typeChildren = mapInheritedMemberTypeChildren(member.uid, type, targetClass, allClasses);

  return {
    name: member.name[0].value,
    type: type,
    typeChildren: typeChildren,
    uid: member.uid,
    summary: targetClass.summary,
    parentUid: parentUid,
    isDeprecated: getIsDeprecated(targetClass),
    isDeprecatedMessage: getIsDeprecatedMessage(targetClass)
  }
}

function mapInheritedMemberTypeChildren(parentUid, type, targetClass, allClasses){
  if(type.startsWith("System.")) return [];

  const targetChildType = targetClass.syntax.return.type;
  const targetChildClass = allClasses.find(x => x.uid === targetChildType);

  if(!targetChildClass.children) {
    return [];
  };

  return targetChildClass
    .children
    .map(x => allClasses.find(y => y.uid === x))
    .map(x => {
      const typeChildren = targetChildClass.type === "Enum" ? [] : mapInheritedMemberTypeChildren(x.uid, x.syntax.return.type, x, allClasses);
      const type = targetChildClass.type === "Enum" ? "EnumValue" : x.syntax.return.type;

      return {
        name: x.name,
        type: type,
        typeChildren: typeChildren,
        uid: x.uid,
        summary: x.summary,
        parentUid: parentUid,
        isDeprecated: getIsDeprecated(x),
        isDeprecatedMessage: getIsDeprecatedMessage(x)
      }
    });
}

/*************************************************************************************************
 * Map to JSON
 ************************************************************************************************/

function mapJsonView(customDataModel){
  const lines = []
  createJsonLines(customDataModel.members, lines, level = 1);
  return { lines  };
}

function createJsonLines(members, accumulator, level = 1){
  if(level === 1){
    accumulator.push("{");
  }
  const tab = createTab(level);``

  for(let member of members){
    const memberName =  member.isDeprecated ? `<s>${member.name}</s>` : member.name;

    if(member.typeChildren.length){

      if(member.typeChildren.every(x => x.type === "EnumValue")){
        accumulator.push(`${tab}"${memberName}": "Enum",`);
      } else{
        accumulator.push(`${tab}"${memberName}": {`);
        createJsonLines(member.typeChildren, accumulator, level+1)
        accumulator.push(`${tab}},`);
      }

    } else{
      accumulator.push(`${tab}"${memberName}": "${member.type}",`);
    }
  }

  if(level === 1){
    accumulator.push("}");
  }

  return 
}

function createTab(amount, whitespace = "&nbsp;&nbsp;&nbsp;&nbsp;"){
  let output = '';
  for(let i = 0; i< amount ; i++){
    output+= whitespace;
  }
  return output;
}

/*************************************************************************************************
    Map to Table
 ************************************************************************************************/

function mapTableView(customDataModel){
  const lines = [];
  const namePrefixes = [];
  createTableLines(customDataModel.members, lines, namePrefixes);
  return { lines  };
}

function createTableLines(members, accumulator, namePrefixes){
  for(let member of members){
    let information = null;
    if(member.typeChildren.length && member.typeChildren.every(isEnumValueType)){
      information = "Enum Values: " + member.typeChildren.map(({name, isDeprecated, isDeprecatedMessage}) => isDeprecated ? `<s>"${name}"</s> (Deprecated: ${isDeprecatedMessage})` : `"${name}"`).join(",<br>");
    }

    accumulator.push({
      name: [...namePrefixes, member.name].join("."),
      type: member.type,
      summary: member.summary,
      information: information,
      isDeprecated: member.isDeprecated,
      isDeprecatedMessage: member.isDeprecatedMessage
    });

    if(member.typeChildren.every(isEnumValueType) === false){
      namePrefixes.push(member.name);
      createTableLines(member.typeChildren, accumulator, namePrefixes)
    }

  }
}

/*************************************************************************************************
    Util Functions
 ************************************************************************************************/

function print(obj){
  if(doLog){
    if(typeof obj){
      console.log(JSON.stringify(obj, null, 4))
    } else { 
      console.log(obj)
    }
  }
}

