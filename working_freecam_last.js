/eval
let freecamEnabled = false;
let originalCam;
let freecam;
let prop;

function enableFreecam() {
  if (freecamEnabled) return;
  const [x,y,z] = GetEntityCoords(PlayerPedId(),false);
  freecamEnabled = true;
  originalCam = GetRenderingCam();
  freecam = CreateCam('DEFAULT_SCRIPTED_CAMERA', true);
  prop = CreateObject('p_camera01x', x, y, z, false, true, true);
  SetEntityVisible(prop, false)
  AttachCamToEntity(freecam, prop, 0, 0, 0, true);
  SetCamActive(freecam, true);
  RenderScriptCams(true, false, 0, true, false);
}

function disableFreecam() {
  if (!freecamEnabled) return;
  freecamEnabled = false;
  SetCamActive(freecam, false);
  RenderScriptCams(false, false, 0, true, false);
  DestroyCam(freecam, false);
  DeleteObject(prop);
}

function moveFreecam() {
  const speed = 0.1;
  const rotationSpeed = 0.00000001;
  let [x, y, z] = GetEntityCoords(prop);
  let [pitch, roll, yaw] = GetGameplayCamRot(2);
  const radiansX = pitch * Math.PI / 180.0;
  const radiansZ = -yaw * Math.PI / 180.0;
  const forwardX = Math.sin(radiansZ) * Math.cos(radiansX);
  const forwardY = Math.cos(radiansZ) * Math.cos(radiansX);
  const forwardZ = Math.sin(radiansX);
  const rightX = Math.sin(radiansZ - Math.PI / 2);
  const rightY = Math.cos(radiansZ - Math.PI / 2);

  if (IsControlPressed(0, 0x8FD015D8)) { // W key
    x += speed * forwardX;
    y += speed * forwardY;
    z += speed * forwardZ;
  }
  if (IsControlPressed(0, 0xD27782E3)) { // S key
    x -= speed * forwardX;
    y -= speed * forwardY;
    z -= speed * forwardZ;
  }
  if (IsControlPressed(0, 0x7065027D)) { // A key
    x += speed * rightX;
    y += speed * rightY;
  }
  if (IsControlPressed(0, 0xB4E465B4)) { // D key
    x -= speed * rightX;
    y -= speed * rightY;
  }
  if (IsControlPressed(0, 0xDB096B85)) { // Left Ctrl key
    z -= speed;
  }
  if (IsControlPressed(0, 0xD9D0E1C0)) { // Space key
    z += speed;
  }

  SetEntityCoordsNoOffset(prop, x, y, z, false, false, false);

  const mouseX = Citizen.invokeNative("0x11E65974A982637C", 0, 0xA987235F);
  const mouseY = Citizen.invokeNative("0x11E65974A982637C", 0, 0xD2047988);
  yaw -= mouseX * rotationSpeed / 2440;
  pitch -= mouseY * rotationSpeed / 1440;

  SetCamRot(freecam, pitch, roll, yaw, 2);
}


let ticker = setTick(() => {


  if (IsControlJustPressed(0, 0x430593AA)) { // [ key
    enableFreecam();
    FreezeEntityPosition(pp, true)
  } else if (IsControlJustPressed(0, 0xA5BDCD3C)) { // ] key
    disableFreecam();
    FreezeEntityPosition(pp, false)
    clearTick(ticker)
  }

  if (freecamEnabled) {
    moveFreecam();
  }
});
