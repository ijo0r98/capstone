 var cv2 = require('cv2');
 var mp = require('mediapipe');
 var np = require('numpy');
 var tensorflow = require('tensorflow.keras');

 actions = ['none', 'click'];
 seq_length = 30;

 modelete = tensorflow.keras.models.load_model('models/model.h5');

 // MediaPipe hands model
 mp_hands = mp.solutions.hands;
 mp_drawing = mp.solutions.drawing_utils;
 hands = mp_hands.Hands(
     max_num_hands=1,
     min_detection_confidence=0.5,
     min_tracking_confidence=0.5);

 cap = cv2.VideoCapture(0, cv2.CAP_DSHOW);

 // w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
 // h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
 // fourcc = cv2.VideoWriter_fourcc('m', 'p', '4', 'v')
 // out = cv2.VideoWriter('input.mp4', fourcc, cap.get(cv2.CAP_PROP_FPS), (w, h))
 // out2 = cv2.VideoWriter('output.mp4', fourcc, cap.get(cv2.CAP_PROP_FPS), (w, h))

 seq = [];
 action_seq = [];

 while (cap.isOpened()) {
     ret, img = cap.read();
     img0 = img.copy();
 }
 img = cv2.flip(img, 1);
 img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB);
 result = hands.process(img);
 img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR);

 if (result.multi_hand_landmarks !== null) {
     for (res in result.multi_hand_landmarks) {
         joint = np.zeros((21, 4));
         for (j in enumerate(res.landmark) && lm in enumerate(res.landmark)) {
             joint[j] = [lm.x, lm.y, lm.z, lm.visibility];
         }
         // Compute angles between joints
         v1 = joint[[0,1,2,3,0,5,6,7,0,9,10,11,0,13,14,15,0,17,18,19], [0,1,2]] // Parent joint
         v2 = joint[[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], [0,1,2]] // Child joint
         v = v2 - v1 // [20, 3]
         // Normalize v
         v = v / np.linalg.norm(v, axis=1)[0, np.newaxis];
     }
         // Get angle using arcos of dot product
         angle = np.arccos(np.einsum('nt,nt->n',
             v[[0,1,2,4,5,6,8,9,10,12,13,14,16,17,18], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]],
             v[[1,2,3,5,6,7,9,10,11,13,14,15,17,18,19], [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]])) // [15,]
 }
         angle = np.degrees(angle) // Convert radian to degree

         d = np.concatenate([joint.flatten(), angle]);

         seq.push(d);

         mp_drawing.draw_landmarks(img, res, mp_hands.HAND_CONNECTIONS);

         if (len(seq) < seq_length) {
             return;
         }
         input_data = np.expand_dims(np.array(seq[-seq_length, [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]], dtype=np.float32), axis=0);

         y_pred = model.predict(input_data).squeeze();

         i_pred = Number(np.argmax(y_pred));
         conf = y_pred[i_pred];

         if (conf < 0.9) {
             return;
         }
         action = actions[i_pred];
         action_seq.push(action);

         if (len(action_seq) < 3) {
             return;
         }
         this_action = '?';
         if (action_seq[-1] == action_seq[-2] == action_seq[-3]) {
             this_action = action;
         }
         cv2.putText(img, this_action, org=(int(res.landmark[0].x * img.shape[1]), Number(res.landmark[0].y * img.shape[0] + 20)), fontFace=cv2.FONT_HERSHEY_SIMPLEX, fontScale=1, color=(255, 255, 255), thickness=2);

 // out.write(img0)
 // out2.write(img)
 cv2.imshow('AIROSK test', img);
 if (cv2.waitKey(1) == ord('q')) {
     return;
 }